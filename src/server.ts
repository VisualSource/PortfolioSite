import * as fastify from "fastify";
import * as helment from 'fastify-helmet';
import * as cors from 'fastify-cors';
import * as jwt from "express-jwt";
import * as staticFiles from 'fastify-static';
import * as jwks from 'jwks-rsa';
import {Server, IncomingMessage, ServerResponse} from 'http';
import {join} from 'path';
import { v4 as uuidv4 } from 'uuid';;

declare module "fastify"{
    export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  >{
   
  }
}


const jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: 'https://visualsource.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://visualsource.herokuapp.com',
  issuer: 'https://visualsource.auth0.com/',
  algorithms: ['RS256']
});
const PORT = process.env.PORT || 8000;
const server: fastify.FastifyInstance<Server, IncomingMessage,ServerResponse> = fastify();
server.register(helment,{dnsPrefetchControl: false});
server.register(cors,{
    credentials: true,
    origin:[
        "http://localhost:3000",
        "http://127.0.0.1:5500",
        "https://127.0.0.1:8000",
        "http://127.0.0.1:8000",
        "https://visualsource.000webhostapp.com",
        "https://visualsource.herokuapp.com/"
    ]});
server.register(staticFiles,{ root: join(__dirname, "public")});

//server.use(jwtCheck);
server.ready(err=>{ if(err) throw new Error(`Websocket lunch err: ${err}`); });
/*const PolytopiaSocket = io(server.server,{
    path: "/online",
    serveClient: false,
    origins: ["http://localhost:3000","http://127.0.0.1:5500","http://127.0.0.1:8000","https://visualsource.000webhostapp.com"]
});*/
//https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit
const io: SocketIO.Server = require("socket.io")(server.server);

const games = {};
const users = {};
io.of("/polytopia").on("connection",(socket)=>{});
io.of("/kevin").on("connection",(socket)=>{


   socket.on("new_game",(settings)=>{
      const roomId = uuidv4();
        games[roomId] = {
            settings,
            users: {}
        }
      socket.join(roomId);
      users[socket.id] = roomId;
      KevinEmit(roomId,"new_game",{room: roomId});
   });

   socket.on("join_game",(data)=>{
       if(Object.keys(games[data.uuid]).length < 2 ){
        const other = Object.keys(games[data.uuid].users).find(id => id !== data.id);
        users[socket.id] = data.id;
        socket.join(data.uuid);
        socket.emit("opponent_init",{ data: games[data.uuid].users[other], id: other, room: data.room});
       }else{
        socket.emit("game_full");
       }
      
   });

   socket.on("init",(data)=>{
       const room = games[data.room];
       room.users[data.id] = data.data;
       socket.broadcast.to(data.room).emit("opponent_init",data);
   });

   socket.on("disconnect",()=>{
       socket.leaveAll();
       delete games[users[socket.id]].users[socket.id];
       if(Object.keys(games[users[socket.id]].users).length === 0) delete games[users[socket.id]];
       delete users[socket.id];
   });

});

function KevinEmit(room: string, event: string, data: any){
    io.of("/kevin").to(room).emit(event, data);
}






server.route({
    method: "GET",
    url: "/",
    handler: async(request,reply)=>{
        reply.sendFile("404.html");
    }
});


const start = async()=>{
    try{
        await server.listen(Number(PORT), '0.0.0.0');
        console.log("Server at", PORT);
        
    }catch(err){
        console.error(err);
        server.log.error(err);
        process.exit(1);
    }
}

server.setNotFoundHandler((request,reply)=>{
    reply.sendFile("404.html")
});

start();