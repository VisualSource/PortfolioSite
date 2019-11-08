const uuidv5 = require('uuid/v5');
const knex = require('./db');
const {http, websocket} = require('./codes')

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
         let data = await knex.column(req.params.faction).select().from('score').then(res=>res).catch(err=>{rep.code(http.client_error.not_found).send({error:"Could not find resource."})});
         return {payload: data};
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
                    reply.code(http.client_error.bad_request).send({error:"Invalid"});
                    break;
            }
        }catch(err){
            reply.code(http.client_error.bad_request).send({error:"Invalid request"});
        }
    }
}
 async function routeAddUser(req,reply){
        const id = req.params.id;
        knex.transaction(trx=>{
                 trx.insert({
                     id,
                     data: {
                       friends: [],
                       inGames: [],
                       savedOnlineGames:[],
                       joined: new Date()
                     }
                 }).into('user').then(trx.commit).catch(trx.rollback)
             })
             .catch(err=>{reply.code(http.client_error.bad_request).send({error:"Invalid"})})
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
/**
 * sql string escape function
 *
 * @param {string} str
 * @returns {string}
 */


module.exports = {routeThrownRoom, routeCreate, routeAddUser};
