import {FastifyRequest, FastifyReply} from "fastify";
import {ServerResponse} from 'http';
import * as knex from 'knex';
import * as jwt from 'jsonwebtoken';
const codes = {
    succes: {
        ok: 200,
        accepted: 202,
        no_content: 204
    },
    client_error:{
        bad_request: 400,
        unauthorized: 401,
        forbidden: 403,
        not_found: 404,
        method_not_allowed: 405,
        not_acceptable: 406,
        conflict: 409,
        gone: 410,
        client_closed_request: 499
    },
    server_error:{
        internal_server_error: 500,
        not_implemented: 501,
        service_unavalable: 503,
        timeout_occurred: 524,
        unknown_error: 520,
        connection_timed_out: 522
    }
}
async function validate(request) {
    const requestKey = await request.headers.authorization.replace("Bearer ","");
    const data = await jwt.verify(requestKey, '0220ef11b22e4955ad3175dba9b84fa9')
    if(data.host !== "polytopia") return new Error("Invaild Host");
    return data.user;
}
const DATABASE_URL: string = process.env.DATABASE_URL;
const production: boolean = Boolean(process.env.isProduction) || false;
let database: knex;
if(production){
    database = knex({
        client: "pg",
        connection: {
            connectionString: DATABASE_URL,
            ssl: true
        }
    })
}else{
    database = knex({
        client:"pg",
        connection: {
          host: "127.0.0.1",
          user:"postgres",
          password:"root",
          database:"visualsource",
          port: 5433
        },
        debug: false,
        asyncStackTraces: false
      })
}


// await database("scores").columns(get).select().orderBy("scores","asc").limit(10);
export async function Scores(request: FastifyRequest,reply: FastifyReply<ServerResponse>){
     return {data: [{user: "", "XinXi": 0}]}
}
export async function Ratings(request: FastifyRequest,reply: FastifyReply<ServerResponse>){
        const user = await validate(request);
        const responce = await database("users").where("user","=", user).select("ratings","gamesplayed","user").then((e: any)=>{
            return database("scores").select("*").where("user","=",e[0].user).then((d)=>{
                return {
                    ratings: e[0].ratings,
                    gamesplayed: e[0].gamesplayed,
                    scores: {
                        "Xin-xi":d[0].XinXi,
                        Imperius: d[0].Imperius,
                        Bardur: d[0].Bardur,
                        Oumaji: d[0].Oumaji
                    }
                }
            })
            
        }).catch(e=>{
            reply.code(codes.client_error.bad_request).send({error: "invaild user"});
        })
        return responce;
}