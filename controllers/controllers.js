const uuidv5 = require('uuid/v5');
const knex = require('./db');
const {http } = require('./codes')

const APP_NAMESPACE_ID = "c42d2542-c807-4eff-86fe-4474666c8078";
const APP_NAMESPACE_NAME = "POLYTOPIAGAMEUUID";
/**
 * =================================================================
 * =================================================================
 *
 *  Start of defined routes
 *
 * =================================================================
 * =================================================================
 */

 /**
  *  Route for getting a faction's scores.
  *  @returns object with socres for {:faction}
  *  @acceptes { "ammount": 100 }
  *
  */
const routeThrownRoom = {
    method: "POST",
    url: "/throneroom/:faction",
    preHandler: [makeBodyJson],
    handler: async(req,rep)=>{
        const data = await knex("score").column(req.params.faction).select("id").then( async(res)=>{
           let factionData = [];
           for(let user in res){
            const userdata = await knex('user').select('username').where("id","=",res[user].id).then(name=>{
                return Object.assign({}, { score: res[user][req.params.faction] }, name[0])  
             }); 
             factionData.push(userdata);
           }
           return factionData;
         });
         return data;
    }
}
/**
 * Route for getting uuid and other data need form client
 * @acceptes { "request": "uuid" }
 */
const routeCreate = {
    method: "POST",
    url: "/create",
    preHandler: [makeBodyJson],
    handler: async(req,reply)=>{
        try{
            if(!req.body || !req.body.request){
                throw new Error("No request or no data.")
            }
            switch (req.body.request) {
                case "uuid":
                    reply.code(http.succes.ok).send({ uuid: uuidv5(APP_NAMESPACE_NAME,APP_NAMESPACE_ID)});
                default:
                    reply.code(http.client_error.bad_request).send({error:"Unkown request", statusCode: http.client_error.bad_request});
                    break;
            }
        }catch(err){
            reply.code(http.client_error.bad_request).send({error:"Missing request", statusCode: http.client_error.bad_request});
        }
    }
}
 function routeAddUser(req,reply){
        const id = req.params.id;
        if(id === undefined) reply.code(http.client_error.bad_request).send({error:"No user", statusCode: http.client_error.bad_request});
        knex.transaction(trx=>{
            trx.insert({
                id,
                data:{
                    friends: [],
                    inGames: [],
                    savedOnlineGames:[]
                }
            }).into("user").returning(["id"]).then(id=>{
                return knex("score").insert({
                    id: id[0].id,
                    imperius: 0,
                    'xin-xi': 0,
                    bardar: 0,
                    oumaji: 0,
                    vengir: 0
                }).then(()=>{reply.code(http.succes.accepted).send({statusCode: http.succes.accepted})})
            }).then(trx.commit).catch(trx.rollback);
        }).catch((err)=>{reply.code(http.client_error.bad_request).send({error:"Invaild", statusCode: http.client_error.bad_request})});
    }
/**
 * =================================================================
 * =================================================================
 *
 *  End of defined routes
 *
 * =================================================================
 * =================================================================
 */
function makeBodyJson(req,reply,done){
    try {
        const data = JSON.parse(req.body);
        req.body = data;
        done();
    } catch (error) {
        done()
    }
}
module.exports = {routeThrownRoom, routeCreate, routeAddUser};
