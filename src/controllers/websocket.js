

const webSocket = (ws,conn)=>{
    ws.on('message',message=>{
        let messageArray;

        try{
            messageArray = JSON.parse(message); 
        }catch(err){
            messageArray = "null";
        }
        
        ws.send(JSON.stringify(messageArray));
    });
}

module.exports = webSocket;