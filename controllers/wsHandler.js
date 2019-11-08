const knex = require("./db");
const {http, websocket} = require("./codes");
/** @type {object} */
let userArray = {};
/**
 * @typedef ClientMessage
 * @type {object}
 * @property {string} type - The type of message being sent.
 * @property {object=} payload - Holdes all params that are being sent
 * @property {string} id - Id of the client
 * @property {Date} date - day and time message was sent
 */
/**
  * @typedef ServerMessage
  * @type {object}
  * @property {string} type - type of message
  * @property {number} statusCode - status of request
  * @property {object=} data - returning data
  * @property {Date} date - day and time sending message
  */
/**
 * @typedef ServerSocket
 * @type {object}
 * @property {number} readState
 * @property {number} bytesReceived
 * @property {object} extensions
 * @property {(string|string[])} protocol
 * @property {function} onerror
 * @property {functon} onopen
 * @property {function} onmessage
 * @property {function} on
 *
 */
/**
 * @typedef Connection
 * @type {object}
 * @property {ServerSocket} socket
 */
/**
 * main Websocket handler for polytopia multiplayer game
 * @param {Connection} socket
*/
function wsHandler(socket){
    /** @param {string} msg */
    const send = msg =>{
        socket.send(JSON.stringify(Object.assign({},msg, {date: Date.now()})))
    }
    /** @param {ClientMessage} msg*/
    const messageHandler = msg =>{
        try{
            /** @type {ClientMessage}*/
            const data = JSON.parse(msg);

            switch (data.type) {
                case "LOGIN":{
                    knex.select('id').from("user").where("id","=", data.id).catch(()=>{
                        send({type:"ERROR", statusCode: http.client_error.bad_request});
                        socket.close(websocket.invaild_frame_playload,"Invalid User");
                    });
                  break;
                }
                default:
                    send({type:"ERROR", statusCode: http.client_error.not_acceptable});
                    break;
            }

        }catch(err){
            send({type:"ERROR", statusCode: http.client_error.bad_request});
            socket.close(websocket.invaild_frame_playload,"Invalid frame payload data");
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