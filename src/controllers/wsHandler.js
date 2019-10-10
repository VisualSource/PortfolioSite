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
 *  406 Not Acceptable
 *  409 Conflict
 */
/**
 * @param {} req
 * @param {WebSocket} con
 */
const wsHandler = (con,req,params)=>{
 /**
   @param {string} msg
 */
 const send = (msg)=>{
     con.socket.send(JSON.stringify(msg));
 }
 con.socket.on('message',msg=>{
     let parsedMsg = {};
     try{
        parsedMsg = JSON.parse(msg);
     }catch(e){
        con.socket.send(JSON.stringify({status:400}));
        parsedMsg = {data:null};
     }
     switch (parsedMsg.type) {
        case "LOGIN":
            send({status: 204})
             break;
        case "UPDATE":
            send({status: 204})
             break;
        case "JOIN":
            send({status: 204})
            break;
        case "CREATE":
             send({status: 204})
            break;
        case "EXIT":
            send({status: 202})
            con.socket.terminate();
            break;
        default:
             send({status: 400})
             break;
     }

 });


}
module.exports = wsHandler;