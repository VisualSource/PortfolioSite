const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL || "localhost:5432";
const path = require("path");
const wsHandler = require("./src/controllers/wsHandler");
const controllers = require("./src/controllers/controllers")
const fastify = require("fastify")({ logger: false });
const knex = require('knex')({
  client:"pg",
  connection:{
    host:DATABASE_URL,
    user:"postgres",
    password:"root",
    database:"visualsource"
  }
});
fastify.register(require("fastify-websocket"));
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public")
});
fastify.use(require("sanitize").middleware);

fastify.get("/polytopia", { websocket: true }, wsHandler);

fastify
  .decorate('verifyUserAndPassword', async (request, reply)=> {
    let test = await request;
    return new Error("Just What we need")
  })
  .register(require('fastify-auth'))
  .after(() => {
    fastify.route({
      method: 'GET',
      url: '/auth',
      preHandler: fastify.auth([
        fastify.verifyUserAndPassword
      ]),
      handler: (req, reply) => {
        req.log.info('Auth route')
        reply.send({ hello: "test" })
      }
    })
  });

fastify.route({
  method: "POST",
  url:"/user/:id",
  handler:(req,reply)=>{
    reply.status(400).send({http:"No Content"})
  }
});

fastify.route({
  method: "POST",
  url:"/login",
  handler:(req,reply)=>{
    reply.status(400).send({http:"No Content"})
  }
});


fastify.post("/throneroom/:faction", ()=>{});
fastify.get("/", async (request, reply) => {
  reply.sendFile("index.html");
});

fastify.setNotFoundHandler(
  {
    preValidation: (req, reply, done) => {
      done();
    },
    preHandler: (req, reply, done) => {
      done();
    }
  },
  (request, reply) => {
    reply.sendFile("404.html");
  }
);

const start = async () => {
  try {
    await fastify.listen(PORT);
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
