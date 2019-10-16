//env vars
const PORT = process.env.PORT || 8000;

//node modules
const path = require("path");
const fs = require("fs");

// custom files
const controllers = require('./controllers/controllers');
const wsHandler = require("./controllers/wsHandler");

//npm modules
/**
 https: {
    key: fs.readFileSync('https/key.pem'),
    cert: fs.readFileSync('https/server.crt')
  }
 */
const fastify = require("fastify")({ //curl localhost:8000/user/BoomIsHere -X POST -i -H @header.text -d '@test.json'
  http2: false,
  
});
const helment = require('fastify-helmet');

// auth
const authenticate = {realm: 'polytopia'};

// fastify plugins
fastify.register(require("fastify-websocket"));
fastify.register(require('fastify-accepts'));
fastify.register(require('fastify-cookie'))
fastify.register(helment,{dnsPrefetchControl: false,})
fastify.register(require('fastify-basic-auth'), { validate: controllers.validate, authenticate })
fastify.register(require("fastify-static"), {root: path.join(__dirname, "public")});


//websocket
fastify.get("/polytopia", { websocket: true }, wsHandler);

// routes
fastify.register(require('fastify-auth'))
.after(() => {
    fastify.route({
      method: 'POST',
      url: '/user/:id',
      preHandler: [controllers.checkOrgin,fastify.auth([fastify.basicAuth])],
      handler: controllers.getUser
    })});
fastify.route(controllers.routeLogin);
fastify.route(controllers.routeThrownRoom);
fastify.route(controllers.routeRegister);
fastify.get("/", async (request, reply) => { reply.sendFile("index.html"); });


// handlers
fastify.setNotFoundHandler({
       preValidation: (req, reply, done) => { done(); },
       preHandler: (req, reply, done) => { done(); }
  },
  (request, reply) => { reply.sendFile("404.html");}
);
/**
 * 2xx Succes
 *  200 Ok
 *  202 Accepted
 *  204 No Content
 * 4xx Client Errors
 *  400 Bad Request
 *  401 unauthorized
 *  403 Forbidden
 *  404 Not Found
 *  406 Not Acceptable
 *  409 Conflict
 */
fastify.setErrorHandler( (err, req, reply) => {
  if (err.statusCode === 401) { reply.code(401).send({ payload: 'unauthorized' }) }
  reply.send(err.statusCode)
});

// start
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
module.exports = fastify;
