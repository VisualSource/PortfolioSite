

const onMessageHandler = async(msg) =>{
    /** @type {import("../diff/index").ServerMessage}*/
    let data = await JSON.parse(msg.data);
    console.log(data)
    switch (data.type) {
         case "LOGIN":
             data.payload.token = ws.userToken;
             break;
         case "SYSTEM":
            ws.messageSystem.push(data);
            break;
         case "GAME":
            ws.messageGame.push(data)
            break;
         case "REQUEST":
            ws.getRequest.push(data);
            break;
         case "ERROR":

             break;
         default:
            break;
    }
 }
 const onCloseHandler = event =>{
    ws.send({type:"EXIT"})
  
 }
 const onErrorHandler = event =>{
      ws.errorMessages.push({type:"client", error: event});
 }
 /** @type {import("../diff/index").WebSocketClient}*/
 export const ws = {
     socket: null,
     userToken: null,
     systemMessage: [],
     gameMessage: [],
     requestReponse: [],
     errorMessages: [],
     currentRequest: function(){
         return this.requestReponse[this.requestReponse.length-1];
     },
     init: function(id = null, token = null, host = "ws://localhost:8000/polytopia"){
         try{
             this.socket = new WebSocket(host);
             this.socket.onopen = ()=>{
                 // login to the websocket my send auth0 Token and user id
                   const loginMsg = {
                                         type:"LOGIN",
                                         payload:{
                                             token
                                         },
                                         id,
                                         date: Date.now()
                                     };
                   this.socket.send(JSON.stringify(loginMsg));
                   this.readyState = this.socket.readyState;
             };
             this.socket.onmessage = onMessageHandler;
             this.socket.onclose = onCloseHandler;
             this.socket.error = onErrorHandler;
             this.readyState = this.socket.readyState
         }catch(e){
             //TODO, and method to try to reconecct!
            console.error("Websocket error")
         }
         return this;
     },

     send: async function(msg){
         try{
             this.socket.send(JSON.stringify(Object.assign({},msg,{id: this.userToken, date: Date.now()})));
         }catch(e){
             //TODO, and method to try again
             console.warn("Did not send msg");
         }
         return this;
     },
     quit: async function(){
         if(this.socket !== null){
             this.socket.close();
             this.socket = null;
         }
         return this;
     },
     reconnect: async function(){
         this.quit();
         this.init();
         return this;
     }
 }
 