import * as io from 'socket.io';
import {Server, IncomingMessage, ServerResponse} from 'http';
import * as fastify from "fastify";


export function init(server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse>){
   const socket = io();
   
   socket.attach(server.server,{
       serveClient: false
   });

   socket.on("connection",(event)=>{
      event.send("A User connected")
   });
   socket.on("connect",(scoket)=>{
       socket.emit("TEST","te")
   });
}
    
  




