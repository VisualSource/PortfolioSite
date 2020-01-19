import * as fastify from "fastify";
import * as helment from 'fastify-helmet';
import * as cors from 'fastify-cors';
import * as jwt from 'jsonwebtoken';
import * as staticFiles from 'fastify-static';
import * as auth from 'fastify-auth';
import {Scores, Ratings} from './handlers'
import {Server, IncomingMessage, ServerResponse} from 'http';
import {join} from 'path'
import { decode } from "punycode";

declare module "fastify"{
    export interface FastifyInstance<
    HttpServer = Server,
    HttpRequest = IncomingMessage,
    HttpResponse = ServerResponse
  >{
    bearerAuth(request, reply)
  }
}

const PORT = process.env.PORT || 8000;
const server: fastify.FastifyInstance<Server, IncomingMessage,ServerResponse> = fastify();
server.register(helment,{dnsPrefetchControl: false});
server.register(cors,{origin:
    ["http://locahost:3000",
    "http://127.0.0.1:5500",
    "https://127.0.0.1:8000",
    "http://127.0.0.1:8000",
    "https://visualsource.000webhostapp.com",
    "https://visualsource.herokuapp.com/"]
});
server.register(staticFiles,{ root: join(__dirname, "public")})

server.ready(err=>{
    if(err) throw new Error(`Websocket lunch err: ${err}`);
});

server.decorate('bearerAuth', async function (request, reply) {
    const requestKey = await request.headers.authorization.replace("Bearer ","");
     jwt.verify(requestKey, '0220ef11b22e4955ad3175dba9b84fa9', function(err, decoded) {
      if(err) return new Error(err.name);
      if(decoded.host !== "polytopia") return new Error("Invaild Host");
      return "OK";
    });
}).register(auth).after(()=>{
    // registor routes here
    server.route({
        url: "/",
        method: "GET",
        handler: async(request,reply)=>{
            reply.sendFile('index.html');
        }
    })
    server.route({
        url: "/scores",
        method: "POST",
        handler: Scores 
    });
    server.route({
        url:"/throneroom",
        method: "POST",
        preHandler: server.auth([server.bearerAuth]),
        handler: Ratings
    });
    server.route({
        url: "/maps",
        method: "GET",
        handler: async()=>{  return {error:"not Implemented"}}
    })
});


const start = async()=>{
    try{
        await server.listen(Number(PORT), '0.0.0.0');
    }catch(err){
        console.error(err);
        server.log.error(err);
        process.exit(1);
    }
}
process.on("uncaughtException", err=>{
    console.error(err);
});
process.on("unhandledRejection",err=>{
    console.error(err);
});

server.setNotFoundHandler((request,reply)=>{
    reply.sendFile("404.html")
});
server.setErrorHandler((err,request,reply)=>{
    if(err.statusCode === 401){
        reply.code(401).send({ payload: 'unauthorized' });
    }
    console.error(err);
    reply.send({error: err.statusCode})
});
start();