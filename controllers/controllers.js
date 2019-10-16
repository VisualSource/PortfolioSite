const sanitizer = require('sanitizer');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const knex = require('./db')
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
  * 
  */
const routeThrownRoom = {
    method: "POST",
    url: "/throneroom/:faction",
    preHandler: checkOrgin,
    handler: async(req,rep)=>{
         let data = await knex.select(req.params.faction).from('score').where('faction','=',req.params.faction).catch(err=>{rep.code(404).send({payload:"Could not find resource."})});
         return data;
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
                return new Error("Invalid")
            }
        }catch(err){
            reply.code(400).send("Invalid")
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
             .catch(err=>{reply.code(400).send("Invalid")})
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
          reply.code(400).send({payload:"Invalid submission"})
      }
      const username =  escapeString(sanitizer.escape(req.body.username));
      const password = escapeString(sanitizer.escape(req.body.password));
      knex.select('username','hash').from('login').where('username','=', username)
      .then(async (data)=>{
          const isValid =  await bcrypt.compare(password, data[0].hash);
          if(isValid){
             knex.select().from('user').where('username','=',username).then(user=>reply.code(200).send(user[0])).catch(err=>{reply.code(500).send({payload:"Failed to get user."})})
          }else{
              reply.code(400).send({payload:"Invalid Credentials."})
          }
      }).catch(err=>{reply.code(404).send({payload:"Could not find user."})})
  }
}
/**
 * Route /user/:id handler
 * @param {FastifyRequest} req
 * @param {FastifyReply} reply
 */
function getUser(req,reply){
        reply.code(200).send({payload:`No User was found at ${req.params}`}); 
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
        let header = Buffer.from(req.headers.authorization.replace("Basic ",""),"base64").toString('utf8');
        let data = await knex.select('username',"id").from("login").where("auth","=", header)
        // bcrypit username and password only because the base64 is already undone
        let validUsername = await bcrypt.compare("'BoomIsHere'" ,username);
        let validPassword = await bcrypt.compare("'Taylor01'",password);
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
    if(req.hostname == "localhost:8000" || req.hostname == "visualsource.webhostapp.com" || req.hostname == "visualsource.herokuapp.com" || req.hostname === "localhost:5432"){
       done()
    }else{
        reply.code(403).send("Invalid host.")
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

module.exports = {validate, checkOrgin, routeLogin, routeThrownRoom, routeRegister, getUser}
