//env vars
const PORT = process.env.PORT || 8000;

//node modules
const path = require("path");
const fs = require("fs");

// custom files
const controllers = require('./controllers/controllers');
const wsHandler = require("./controllers/wsHandler");


/**
 https: {
    key: fs.readFileSync('https/key.pem'),
    cert: fs.readFileSync('https/server.crt')
  }
 */
const fastify = require("fastify")({
  http2: false,
  logger: false

});
const helment = require('fastify-helmet');
// fastify plugins
// request X-Authtoken header
fastify.register(require("fastify-websocket"),{options:{clientTracking: true, verifyClient: (info,next)=>{
     try{
         //if(info.req.headers['x-authtoken']) next(true);
         next(true);
     }catch(err){
       next(false);
     }
}}});
fastify.register(require('fastify-cookie'));
fastify.register(helment,{dnsPrefetchControl: false,});
fastify.register(require('fastify-cors'), { 
 origin: ["http://127.0.0.1:5500","https://127.0.0.1:8000","http://127.0.0.1:8000","https://visualsource.000webhostapp.com","https://visualsource.herokuapp.com/"]
});
fastify.register(require("fastify-static"), {root: path.join(__dirname, "public")});


//websocket
fastify.get("/polytopia", { websocket: true }, wsHandler);

// routes
fastify.register(require('fastify-auth'))
.after(() => {
    fastify.route({
      method: 'POST',
      url: '/user/:id',
      preHandler: [],
      handler: controllers.getUser
    })});
fastify.route(controllers.routeLogin);
fastify.route(controllers.routeThrownRoom);
fastify.route(controllers.routeRegister);
fastify.route(controllers.routeCreate);
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
  reply.send({error: err.statusCode})
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
