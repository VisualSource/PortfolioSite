const knex = require("./db");
const {http, websocket} = require("./codes");
const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');
const client = jwksClient({
  jwksUri: 'https://visualsource.auth0.com/.well-known/jwks.json'
});
function getKey(header, callback){
  client.getSigningKey(header.kid, function(err, key) {
    let signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}


function wsHandler(socket, server){
    /** @param {string|object} msg */
    const send = msg =>{
        socket.send(JSON.stringify(Object.assign(msg, {date: Date.now()})))
    }
    const messageHandler = msg =>{
        try{
            /** @type {import("../diff/index").ClientMessage}*/
            const data = JSON.parse(msg);
            switch (data.type) {
                case "LOGIN":{
                    // verify token from auth0
                  jwt.verify(data.payload.token, getKey,  { algorithms: ['RS256'] }, function(err, decoded) {
                  if(err){
                      //if error return 403 then close socket
                      send({type:"ERROR", statusCode: http.client_error.unauthorized});
                      socket.close(websocket.invaild_frame_playload,"Invaild User");
                  }else{
                      //else create new token and return token and user data field not worlds or current games
                      const token = jwt.sign({ user: data.id, app: "Polytopia"}, 'GENUUID', { expiresIn: '5h' });
                      knex("users").select("data").where("id","=".data.id).then(res=>{
                        send({
                            type:"LOGIN",
                            statusCode: http.succes.accepted,
                            data: {
                                token,
                                user: res
                            }
                        })
                      });
                  }
                });
                break;
                }
                case "REQUEST":{
                    send({client: server.clients})
                    break;
                }
                default:
                    send({type:"ERROR", statusCode: http.client_error.not_acceptable});
                    break;
            }

        }catch(err){
            send({type:"ERROR", statusCode: http.client_error.bad_request});
        }
    }

socket.on('message', messageHandler);
// Need to have error chacher else app crash
socket.onerror = (err)=>{
   if(err.code === "ECONNRESET"){
       console.warn("Websocket System: ECONNREST")
   }else{
       console.error("Websocket System: ", err.code);
   }
}
}
module.exports = wsHandler;





/*
switch (data.type) {
    // SYSTEM RESPONSE
    case "LOGIN": {

        break;
    }
    case "EXIT":
        send({type:"EXIT", statusCode: 499});
        con.socket.close(1000,"Normal Closure");
        break;
     // REQUEST RESPONSE
    case "REQUEST":
        try{
            switch (data.payload.request) {
                case "ALL":
                        console.log(userArray)
                    send({type:"REQUEST", statusCode: 204});
                    break;
                default:
                    send({type:"ERROR", statusCode: 406});
                    break;
            }
        }catch(err){
            send({type:"ERROR", statusCode: 404});
        }
        break;
    // GAME RESPONSE
    case "JOIN":
        send({type:"SYSTEM", statusCode: 204});
        break;
    case "CREATE":
        send({type:"SYSTEM", statusCode: 204});
        break;
    case "LEAVE":
        send({type:"SYSTEM", statusCode: 204});
        break;
    default:
        send({type:"ERROR", statusCode: 400})
        break;
}
*/