const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL || "http://localhost:5001";
const path = require('path')
const fastify = require('fastify')({ logger: true });

fastify.register(require('fastify-websocket'));
fastify.register(require('fastify-static'), {
    root: path.join(__dirname, 'public')
  });


fastify.get('/polytopia', { websocket: true }, (connection, req) => {
    connection.socket.on('message', message => {
      // message === 'hi from client'
      connection.socket.send(message)
    })
  })
fastify.get('*/', async (request, reply) => {
    reply.sendFile('index.html')
});
fastify.post('/user/:id', async (request,reply)=>{
  reply.status(404).type("No Such User");
})





// Run the server!
const start = async () => {
  try {
    await fastify.listen(PORT)
    fastify.log.info(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()