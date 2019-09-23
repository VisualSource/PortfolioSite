const PORT = process.env.PORT || 8000;
const path = require('path');
const wsHandler = require('./src/controllers/wsHandler');
const fastify = require('fastify')({ logger: false });

function getThroneRoom(faction = ""){
   console.log(faction)
    return {data:[]};
}
/**
 * 2xx Succes 
 *  
 *  200 Ok 
 *  202 Accepted
 *  204 No Content
 * 
 * 
 * 4xx Client Errors
 * 
 *  400 Bad Request
 *  401 unauthorized
 *  403 Forbidden 
 *  404 Not Found 
 *  406 Not Acceptable 
 *  409 Conflict
 */
fastify.register(require('fastify-websocket'));
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public')
  });


fastify.get('/polytopia', { websocket: true }, wsHandler);


fastify.post('/user/:id', (request,reply)=>{
  reply.status(409).send({error:"Conflict"})
});
fastify.post('/throneroom/:faction', async (req,rep)=>{
  let data = await getThroneRoom(req.params.faction)
  return data;
});
fastify.get('/', async (request, reply) => {
  reply.sendFile('index.html')
});


fastify.setNotFoundHandler({
  preValidation: (req, reply, done) => {
    done()
  },
  preHandler: (req, reply, done) => {
    done()
  }
}, (request, reply)=> {
    reply.sendFile('404.html')
})

const start = async () => {
  try {
    await fastify.listen(PORT)
    fastify.log.info(`server listening on ${fastify.server.address().port}`);
    console.log(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()