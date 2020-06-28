import * as fastify from "fastify";
import * as helment from 'fastify-helmet';
import * as cors from 'fastify-cors';
import * as jwt from "express-jwt";
import * as staticFiles from 'fastify-static';
import * as jwks from 'jwks-rsa';
import {Server, IncomingMessage, ServerResponse} from 'http';
import {join} from 'path';
import KevinHandler from './handlers/kevinOnline';

declare module "fastify"{
    export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  >{}
}

const orgins = process.env.production === "true" ? [ "https://visualsource.000webhostapp.com","https://visualsource.herokuapp.com"] : ["http://localhost:3000","http://localhost:5500","http://127.0.0.1:5500",];

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
    origin: orgins});
server.register(staticFiles,{ root: join(__dirname, "public")});

//server.use(jwtCheck);
server.ready(err=>{ if(err) throw new Error(`Websocket lunch err: ${err}`); });
//https://stackoverflow.com/questions/32674391/io-emit-vs-socket-emit
const io: SocketIO.Server = require("socket.io")(server.server, {
    serveClient: false,
    origins: orgins
});
io.of("/polytopia").on("connection",(socket)=>{});
io.of("/kevin").on("connection",(socket)=>KevinHandler(socket, io));


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