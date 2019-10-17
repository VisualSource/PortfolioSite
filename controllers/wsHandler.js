//const knex = require("./db");
//const ids = require("./constents");
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
// Over all handers
 con.socket.onerror = (err)=>{
    if(err.code === "ECONNRESET"){
        console.warn("Websocket System: ECONNREST")
    }else{
        console.error("Websocket System: ", err.code);
    }
 }

 con.socket.on('message',msg=>{ console.log(msg);});




}
module.exports = wsHandler;
