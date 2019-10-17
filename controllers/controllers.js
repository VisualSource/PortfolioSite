const sanitizer = require('sanitizer');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const uuidv5 = require('uuid/v5');
const knex = require('./db');
const ids = require("./constents");
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
    preHandler: checkOrgin,
    handler: async(req,rep)=>{
         let data = await knex.column(req.params.faction).select().from('score').then(res=>res).catch(err=>{rep.code(404).send({error:"Could not find resource."})});
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
    preHandler: checkOrgin,
    handler: async(req,rep)=>{
        try{
            if(!req.body || !req.body.request){
                throw new Error("No request or no data.")
            }
        }catch(err){
            rep.code(400).send({error:"Invalid request"});
        }
        switch (req.body.request) {
            case "uuid":
                return { uuid: uuidv5(ids.APP_NAMESPACE_NAME,ids.APP_NAMESPACE_ID)}
            default:
                rep.code(400).send({error:"Invalid"});
                break;
        }
    }
}
/**
 * Route for user registering 
 * @returns user id as a cookie
 */
const routeRegister = {
    method: "POST",
    url: "/register",
    preHandler: checkOrgin,
    handler: async(req,reply)=>{
      try{
            // check for empty body params
            if(!req.body.username || !req.body.password){
               throw new Error("Invalid");
            }
        }catch(err){
            reply.code(400).send({error:"Invalid"})
        }
             // escape html and sql strings
             const username = await escapeString(sanitizer.escape(req.body.username));
             // set vars
             const uuid = await uuidv4();
             const psdHash = await bcrypt.hash(escapeString(sanitizer.escape(req.body.password)), 10);
             const usernameHash =  await bcrypt.hash(username,10);
             const uuidHash = await bcrypt.hash(uuid,10);
             // create auth token and encode with base64
             const authToken = await Buffer.from(`${usernameHash}:${uuidHash}`).toString('base64');
             knex.transaction(trx=>{
                 trx.insert({
                     id: uuid,
                     hash: psdHash,
                     username,
                     auth: authToken
                 }).into('login').returning(['id',"auth"]).then(id=>{
                    return knex('user').returning(['data','username']).insert({
                        id: id[0].id,
                        username,
                        joined: new Date(),
                        data: {
                            friends: [],
                            inGames: [],
                            savedOnlineGames:[]
                        }
                    }).then(data=>{reply.setCookie('auth', id[0].auth,{path:'/'}).code(200).send({payload: data[0]})})
                 }).then(trx.commit).catch(trx.rollback)
             })
             .catch(err=>{reply.code(400).send({error:"Invalid"})})
    }
}
/**
 * Route for user login 
 * @returns user data object and/or auth cookie
 */
const routeLogin = {
  method: "POST",
  url:"/login",
  preHandler: checkOrgin,
  handler:(req,reply)=>{
      if(!req.body.username || !req.body.password){
          reply.code(400).send({error:"Invalid submission"})
      }
      const username =  escapeString(sanitizer.escape(req.body.username));
      const password = escapeString(sanitizer.escape(req.body.password));
      knex.select('username','hash').from('login').where('username','=', username)
      .then(async (data)=>{
          const isValid =  await bcrypt.compare(password, data[0].hash);
          if(isValid){
             knex.select("username","data").from('user').where('username','=',username).then(user=>reply.code(200).send({payload: user[0]})).catch(err=>{reply.code(500).send({error:"Failed to get user."})})
          }else{
              reply.code(400).send({error:"Invalid Credentials."})
          }
      }).catch(err=>{reply.code(404).send({error:"Could not find user."})})
  }
}
/**
 * Route /user/:id handler
 * @param {FastifyRequest} req
 * @param {FastifyReply} reply
 */
function getUser(req,reply){
        reply.code(501).send({error:`No User was found at ${req.params.id} or ${req.body.request}`}); 
}

 // encode Buffer.from("Hello World").toString('base64')
// decode Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii')
/**
 * =================================================================
 * =================================================================
 * 
 *  End of defined routes
 * 
 * =================================================================
 * =================================================================
 */


/**
 * validate a user
 * @param {string} username
 * @param {string} password
 * @param {FastifyRequest} req
 * @param {FastifyReply} reply
 */
// neeeds header of Authorization: Basic USER:PSD
 // create user with password then bcrypt => base64 = user id
 async function validate (username, password, req, reply) {
    try{
        let data = await knex.select('username',"id").from("login").where("auth","=", req.headers.authorization.replace("Basic ","")).then(res=>res[0]);
        // bcrypit username and password only because the base64 is already undone
        let validUsername = await bcrypt.compare(data.username ,username);
        let validPassword = await bcrypt.compare(data.id,password);
        if(!validUsername && !validPassword){
            return new Error("Invalid")
        }
    }catch(err){
        return new Error("Invalid User")
    }

  }
/**
 * check host of request
 *
 * @param {*} req
 * @param {*} reply
 * @param {Function} done
 */
function checkOrgin(req,reply,done){
    if(req.hostname == "localhost:8000" || req.hostname == "visualsource.webhostapp.com" || req.hostname == "visualsource.herokuapp.com"){
       done()
    }else{
        reply.code(403).send({error:"Invalid host"})
    }
    
}
/**
 * sql string escape function
 *
 * @param {string} str
 * @returns {string}
 */
function escapeString (str) {
    return str.replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g,  char => {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
                return "\\"+char; // prepends a backslash to backslash, percent,
                                  // and double/single quotes
        }
    });
}

module.exports = {validate, checkOrgin, routeLogin, routeThrownRoom, routeRegister, routeCreate, getUser}
