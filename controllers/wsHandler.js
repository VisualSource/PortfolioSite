const knex = require("./db");
const {http, websocket} = require("./codes");
const jwt = require('jsonwebtoken');
let request = require("request");

async function verifyUser(token){
    jwt.verify(token,LOGIN_TOKEN_SECERIT, (err, decode)=>{
        if(!err && decode.issuer === "vs_ptm"){
            return;
        }else{
            throw new Error("Invalid JWT");
        }
    })
}
let clients = {};
function wsHandler(socket){

    /** @param {string} msg */
    const send = msg =>{
        socket.send(JSON.stringify(Object.assign(msg, {date: Date.now()})))
    }

    
    function requestMessageHandler(payload){
        switch (payload.request) {
            case "JOIN":
                send({type:"SYSTEM", statusCode: http.server_error.not_implemented, payload:"Not Implemented"});
                break;
            case "CREATE":
                send({type:"SYSTEM", statusCode: http.server_error.not_implemented, payload:"Not Implemented"});
                break;
            case "UPDATE_WORLD":
                send({type:"GAME", statusCode: http.server_error.not_implemented, payload:"Not Implemented"});
                break;
            case "LEAVE_GAME":
                send({type:"GAME", statusCode: http.server_error.not_implemented, payload:"Not Implemented"});
                break;
            case "FINISH_GAME":
                send({type:"GAME", statusCode: http.server_error.not_implemented, payload:"Not Implemented"});
                break;
            case "END_TURN":
                send({type:"GAME", statusCode: http.server_error.not_implemented, payload:"Not Implemented"});
                break;
            default:
                send({type:"SYSTEM", statusCode: http.client_error.bad_request, payload:"Unkown request"});
                break;
        }
    }
    const messageHandler = msg =>{
        try{
            /** @type {import("../diff/index").ClientMessage}*/
            const data = JSON.parse(msg);
            switch (data.type) {
                case "LOGIN":{
                    // verify token from auth0
                    request({
                        url:"https://visualsource.auth0.com/userinfo",
                        method:"GET",
                        headers:{
                            Authorization:`Bearer ${data.payload.token}`
                        }
                    },(err)=>{
                        if(!err) {
                            clients[data.id] = socket;
                            // BUG Client token is NULL, Cant not be null
                            const token = jwt.sign({ sub: data.id, iss: "vs_ptm", aud:"visual_multiplayer"}, 'bc96601b82a6480fb96d79e1cafc7341', { expiresIn: '5h' });
                                knex("user").select("data").where("id","=",data.id).then(res=>{
                                    send({
                                        type:"LOGIN",
                                        statusCode: http.succes.accepted,
                                        payload: {
                                            token: token,
                                            user: res[0]
                                        }
                                    })
                                });
                           
                        }else{
                            send({type:"ERROR", statusCode: http.client_error.unauthorized, payload:"Unauthorized"});
                            socket.close(websocket.invaild_frame_playload,"Invaild User");
                        }
                    })
                break;
                }
                case "REQUEST":
                    verifyUser(data.id).then(()=>{requestMessageHandler(data.payload)}).catch(()=>{send({type:"ERROR", statusCode: http.client_error.unauthorized, payload:"Unauthorized"});})
                    break;
                case "EXIT":
                    jwt.verify(data.id, 'bc96601b82a6480fb96d79e1cafc7341', (err, decode)=>{
                        if(!err){
                            delete clients[decode.sub];
                            send({type:"EXIT", statusCode: http.client_error.client_closed_request, payload:"User Exited"});
                            socket.close(1000,"Normal Closure");
                        }else{
                            send({type:"ERROR", statusCode: http.client_error.bad_request, payload:"Invaild JWT"});
                        }
                    })
                    break;
                default:
                    send({type:"ERROR", statusCode: http.client_error.not_acceptable ,payload: "Unkown Type"});
                    break;
            }

        }catch(err){
            send({type:"ERROR", statusCode: http.client_error.bad_request, payload:"Invalid frame payload data"});
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





