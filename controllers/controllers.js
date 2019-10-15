const fastify = require('../server');
const sanitizer = require('sanitizer');
const knex = require("./db");
const bcrypt = require('bcrypt');
const escapeString = require('sql-string-escape')

/**
 * validate a user
 * @param {string} username
 * @param {string} password
 * @param {FastifyRequest} req
 * @param {FastifyReply} reply
 */
 // create user with password then bcrypt => base64 = user id
async function validate (username, password, req, reply) {
    try{
     // encode Buffer.from("Hello World").toString('base64')
     // decode Buffer.from("SGVsbG8gV29ybGQ=", 'base64').toString('ascii')
       let buff = new Buffer.from(req.headers.authorization.replace("Basic ",""), 'base64');
       let text = buff.toString('acsii');
        console.log(buff,text)
        // bcrypit username and password only because the base64 is already undone
        let validUsername = bcrypt.compareSync("BoomIsHere", username)

        if(false){
            return new Error("Invalid")
        }
    }catch(err){
        return new Error("Invalid User")
    }

  }


/**

        ROUTES

 */
const routeThrownRoom = {
    method: "POST",
    url: "/throneroom/:faction",
    handler: async(req,rep)=>{
         let data = await knex.select(req.params.faction).from('score').where('faction','=',req.params.faction).catch(err=>{rep.code(404).send({payload:"Could not find resource."})});
         return data;
    }
}

/**
  route for handling the register path
*/
const routeRegister = {
    method: "POST",
    url: "/register",
    handler: (req,reply)=>{
      try{
            // if username or password does not have a value return a 400.
            if(!req.body.username || !req.body.password){
                reply.code(400).send({payload:"Invalid submission."});
            }
             // escape html and sql strings
             const username = escapeString(sanitizer.escape(req.body.username));
             const password = escapeString(sanitizer.escape(req.body.password));
             // TODO add username and psd hash to database here before creating auth id;
             // but username and password into basic auth method
             let id = `${bcrypt.hashSync(username, 5)}:${bcrypt.hashSync(password, 5)}`;
            // convert the id into base64
             console.log()
             reply.code(202)
        }catch(err){
            reply.code(400).send({payload:"Invalid"})
        }
    }
}

const routeLogin = {
  method: "POST",
  url:"/login",
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
             knex.select('*').from('users').where('username','=',username).then(user=>reply.code(200).send(user[0]).setCookie("user",user[0].id,{path:'/'})).catch(err=>{reply.code(500).send({payload:"Failed to get user."})})
          }else{
              reply.code(400).send({payload:"Invalid Credentials."})
          }
      }).catch(err=>{reply.code(404).send({payload:"Could not find user."})})
  }
}

module.exports = {validate, routeLogin, routeThrownRoom, routeRegister}
