const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL;

// should require https but server has no SLL
const server = require('http').createServer();
const webSocketServer = new (require('ws')).Server({server:server});


const api = require('./controllers/api');
const websocket = require('./controllers/websocket');


server.on('request', api);

webSocketServer.on('connection',(ws,conn)=>{websocket(ws,conn)})


server.listen(PORT,()=>{console.log(`Listening: ${PORT}. Server Ready`)})