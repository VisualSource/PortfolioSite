const knex = require("./db");
const ids = require("./constents");
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
 //TODO Fix app crash when user disconnect
 con.socket.on('error',err=>{console.log(err)})
 con.socket.on('message',msg=>{
     let parsedMsg = {};
     try{
        parsedMsg = JSON.parse(msg);
        switch (parsedMsg.type) {
            case "LOGIN":
                 send({status: 501})
                 break;
            case "REQUEST":
                send({status: 501})
                break;
            case "UPDATE":
                send({status: 501})
                break;
            case "JOIN":
                send({status: 501})
                break;
            case "CREATE":
                send({status: 501})
                break;
            case "EXIT":
                send({status:501})
                con.socket.close(1000,"Exit websocket");
                break;
            default:
                 send({status: 400})
                 break;
         }
     }catch(e){
        send({status:400});
     }
 });


}
module.exports = wsHandler;
