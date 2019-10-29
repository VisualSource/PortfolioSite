//const knex = require("./db");
//const ids = require("./constents");
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
 * @param {Connection} con
 * @param {*} req
*/
function wsHandler(con,req){
    /**
     * Send message to client
     * @param {string} msg 
     */
    const send = (msg)=>{
        con.socket.send(JSON.stringify(msg))
    }
/**
 * 2xx Succes
 *  200 Ok
 *  202 Accepted
 *  204 No Content
 * 4xx Client Errors
 *  400 Bad Request
 *  401 unauthorized
 *  403 Forbidden
 *  404 Not Found
 *  405 Method not allowed 
 *  406 Not Acceptable
 *  409 Conflict
 *  410 Gone
 *  499 Client Closed Request 
 * 5xx Server Error
 *  500 internal server error
 *  501 not implemented 
 *  503 service unavalable
 *  524 A Timeout occurred
 *  520 unknown Error
 *  522 connection Timed out
 * Websocket status codes
 *  1000 Normal Closure 
 *  1001 Going Away 
 *  1002 Protocol Error
 *  1003 Unsupported Data 
 *  1005 No status Received
 *  1006 Abnormal Closure
 *  1007 Invalid frame payload data
 *  1008 Policy Violation 
 *  1009 Message too big
 *  1010 Missing Extension 
 *  1011 Internal Error
 *  1012 Service Restart
 *  1013 Try Again Later
 */
    /**
     * @param {ClientMessage} msg 
     */
    const messageHandler = (msg) =>{
        try{
            /** @type {ClientMessage}*/
            const data = JSON.parse(msg);
            switch (data.type) {
                // SYSTEM RESPONSE
                case "LOGIN": { 
                    break;
                }
                case "EXIT":
                    send({type:"EXIT", statusCode: 499, date: Date.now()});
                    con.socket.close(1000,"Normal Closure");
                    break;
                 // REQUEST RESPONSE
                case "REQUEST":
                    try{
                        switch (data.payload.request) {
                            case "ALL":
                                    console.log(userArray)
                                send({type:"REQUEST", statusCode: 204, date: Date.now()});
                                break;
                            default:
                                send({type:"ERROR", statusCode: 406, date: Date.now()});
                                break;
                        }
                    }catch(err){
                        send({type:"ERROR", statusCode: 404, date: Date.now()});
                    }
                    break;
                // GAME RESPONSE
                case "JOIN":
                    send({type:"SYSTEM", statusCode: 204, date: Date.now()});
                    break;
                case "CREATE":
                    send({type:"SYSTEM", statusCode: 204, date: Date.now()});
                    break;
                case "LEAVE":
                    send({type:"SYSTEM", statusCode: 204, date: Date.now()});
                    break;
                default:
                    send({type:"ERROR", statusCode: 400, date: Date.now()})
                    break;
            }
        }catch(err){
            send({type:"ERROR", statusCode: 400, date: Date.now()});
            con.socket.close(1007,"Invalid frame payload data");
        }
    }

con.socket.onerror = (err)=>{
   if(err.code === "ECONNRESET"){
       console.warn("Websocket System: ECONNREST")
   }else{
       console.error("Websocket System: ", err.code);
   }
}
con.socket.on('message', messageHandler);
}
module.exports = wsHandler;
