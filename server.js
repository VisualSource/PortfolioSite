//env vars
const PORT = process.env.PORT || 8000
const DEV = process.env.DEV || true;

//node modules
const path = require("path");
//const fs = require("fs");
const helment = require('fastify-helmet');
const jwt = require('jsonwebtoken');
const fastify = require("fastify")({ http2: false, logger: false}); // https: { key: fs.readFileSync('https/key.pem'), cert: fs.readFileSync('https/server.crt') }

// custom files
const controllers = require('./controllers/controllers');
const wsHandler = require("./controllers/wsHandler");


fastify.register(require('./plugins/ws'));
fastify.register(require('fastify-cookie'));
fastify.register(helment,{dnsPrefetchControl: false,});
const origins = DEV ? ["http://locahost:3000","http://127.0.0.1:5500","https://127.0.0.1:8000","http://127.0.0.1:8000","https://visualsource.000webhostapp.com","https://visualsource.herokuapp.com/"] : ["https://visualsource.000webhostapp.com","https://visualsource.herokuapp.com/"];
fastify.register(require('fastify-cors'), {
 origin: origins
});
fastify.register(require("fastify-static"), {root: path.join(__dirname, "public")});

//websocket
fastify.ready(err => {
  if (err) throw err
  console.info("Websocket online")
  fastify.ws.on('connection',socket=>{wsHandler(socket,fastify.ws)})
});

// routes
fastify.decorate('bearerAuth', async function (request, reply) {
    const requestKey = await request.headers.authorization.replace("Bearer ","");
    jwt.verify(requestKey, '48133e08666f4a2a9ecdd1692f429fe3', function(err, decoded) {
      if(err) return new Error(err.name);
      if(decoded.host !== "auth0") return new Error("Invaild Host");
      return "OK";
    });
  }).
register(require('fastify-auth')).after(() => {
    fastify.route({
      method: 'POST',
      url: '/adduser/:id',
      preHandler: fastify.auth([fastify.bearerAuth]),
      handler: controllers.routeAddUser
    })
  });

fastify.route(controllers.routeThrownRoom);
fastify.route(controllers.routeCreate);
fastify.get("/", async (request, reply) => { reply.sendFile("index.html"); });



// handlers
fastify.setNotFoundHandler({
       preValidation: (req, reply, done) => { done(); },
       preHandler: (req, reply, done) => { done(); }
  },
  (request, reply) => { reply.sendFile("404.html");}
);

fastify.setErrorHandler( (err, req, reply) => {
  if (err.statusCode === 401) { reply.code(401).send({ payload: 'unauthorized' }) };
  console.error(err)
  reply.send({error: err.statusCode, errorHandler: true})
});

// start
const start = async () => {
  try {
    await fastify.listen(PORT);
    console.log(PORT)
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();

