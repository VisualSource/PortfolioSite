/**
 * @param {FastifyRequest} req 
 * @param {WebSocket} con 
 */
const wsHandler = (con,req,params)=>{
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
             break;
        case "UPDATE":
             break;
        case "JOIN":
            break;
        case "CREATE":
            break;
        case "EXIT":
            con.socket.send(JSON.stringify({status:200}));
            con.socket.terminate();
            break;
        default:
             con.socket.send(JSON.stringify({status: 406}));
             break;
     }
   
 });
   

}
module.exports = wsHandler;