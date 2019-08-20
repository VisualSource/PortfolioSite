

let webSocketClients = {};


/**
 * 
 * @param {*} ws 
 * @param {*} message 
 */
const send = (ws, message) => {
    ws.send(JSON.stringify(message))
} 

const handlePolytopia = (msgArray,ws) => {
    switch (msgArray.type) {
        case "login":
                send(ws,{status:202})
            break;
        case "update": 
                send(ws,{status:202})
            break;
        case "leave": 
                send(ws,{status:202})
            break;
        case "join":
                send(ws,{status:202})
            break;
        case "create":
                send(ws,{status:201})
            break;
        default:
            send(ws,{status:400})
            break;
    }
}

/**
 * 
 * @param {*} ws 
 * @param {*} conn 
 */
const webSocket = (ws,conn)=>{

    let userID = conn.url.substr(1);
    webSocketClients[userID] = ws;
    console.log('connected: ' + userID);


    ws.on('message',message=>{
        let messageArray;
        try{
            messageArray = JSON.parse(message); 
        }catch(err){
            messageArray = "null";
            send(ws,400);
        }

        switch (messageArray.game) {
            case "polytopia":
                    send(ws,{status:202});
                    handlePolytopia(messageArray,ws)
                break;
        
            default:
                    send(ws,{status:404});
                    ws.terminate();
                break;
        }
        
      
    });
}



module.exports = webSocket;