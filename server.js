const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL || "localhost:5432";
const path = require("path");
const wsHandler = require("./src/controllers/wsHandler");
const controllers = require("./src/controllers/controllers")
const fastify = require("fastify")({ logger: false });
const authenticate = {realm: 'true'};
async function validate (username, password, req, reply) {
  if (username !== 'Tyrion' || password !== 'wine') {
    return new Error('Winter is coming')
  }
}
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
fastify.register(require('fastify-basic-auth'), { validate, authenticate })
fastify.register(require("fastify-static"), {
  root: path.join(__dirname, "public")
});
fastify.use(require("sanitize").middleware);

fastify.get("/polytopia", { websocket: true }, wsHandler);


  fastify.register(require('fastify-auth'))
  .after(() => {
    fastify.route({
      method: 'POST',
      url: '/user/:id',
      preHandler: fastify.auth([
        fastify.basicAuth
      ]),
      handler: (req, reply) => {
          console.log(req.params)
        reply.code(204).send({payload:"No User was found"});
      }
    })
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

fastify.setNotFoundHandler({
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

fastify.setErrorHandler(function (err, req, reply) {
  if (err.statusCode === 401) {
    // this was unauthorized! Display the correct page/message.
    reply.code(401).send({ was: 'unauthorized' })
    return
  }
  reply.send(err)
})

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
