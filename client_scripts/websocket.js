
// types
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
  * @property {object} data - returning data
  * @property {Date} date - day and time sending message
  *
  */




const statusHandler = (status) =>{
    switch(status){
        case 200:
           return "Ok";
        case 202:
            return "Accepted";
        case 204:
            return "No Content";
        case 400:
            return "Bad Request";
        case 401:
            return "Unathorized";
        case 403:
            return "Forbidden";
        case 404:
            return "Not Found"
        case 406:
            return "Not Acceptable";
        case 409:
            return "Conflict";
        case 499:
            return "Client Requested close";
        case 501:
            return "Not Implemented"
        default:
            return "N/A";
    }
}
const onOpenHandler = event=>{
   ws.send({type:"LOGIN", payload:{authToken: "JDJiJDEwJGhyU0w3bk96LzFybnIyMEV3ZmFydnVHc1p4Z1Y0d044WmtHWXBESnViNWlPb1FQMy5kT2lhOiQyYiQxMCRka28wWFlRWVVxQVdTUzhkL3FkSm5PTHo3STVGM3BiQm9qSC9uZy5tUWZUQnVQRFEzbFVlZQ=="}});
    ws.readyState = ws.socket.readyState;
}
/**
 * @param {ServerMessage} msg
 */
const onMessageHandler = async(msg) =>{
   let data = await JSON.parse(msg.data);
   console.log(data)
   switch (data.type) {
       case "SYSTEM":
           ws.messageSystem = data;
           statusHandler(data.statusCode);
           break;
       case "GAME":
           ws.messageGame = data;
           statusHandler(data.statusCode);
           break;
       case "REQUEST":
           ws.getRequest.push(data);
           statusHandler(data.statusCode);
           break;
       default:
           break;
   }
}
const onCloseHandler = event =>{
   ws.readyState = ws.socket.readyState
}
const onErrorHandler = event =>{
     ws.readyState = ws.socket.readyState
}
/**
 * @typedef WS
 * @type {object}
 * @property {WebSocket} socket
 * @property {number} readyState
 * @property {object[]} messageSystem
 * @property {object[]} messageGame
 * @property {object[]} getRequest
 * @property {function} currentRequest
 * @property {function} init
 * @property {function} send
 * @property {function} quit
 * @property {function} reconecct
 */
/**
 * a method for websocket control
 * @type {WS}
 */
export const ws = {
    /**
     * @private
     * @type {WebSocket} socket
     */
    socket: null,
     /**
     * @private
     * @type {number} state
     */
    readyState: "CLOSED",
     /**
     * @private
     * @type {object[]} socket
     */
    messageSystem: [],
    /**
     * @private
     * @type {object[]} socket
     */
    messageGame: [],
    /**
     * @private
     * @type {object[]} socket
     */
    getRequest: [],
    /**
     * @returns {object} get lastest request message
     */
    currentRequest: function(){
        return this.getRequest[ws.getRequest.length-1];
    },
    init: function(host = "ws://localhost:8000/polytopia", user= null){
        try{
            this.socket = new WebSocket(host);
            this.socket.onopen = onOpenHandler;
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
    /**
     * @param {ClientMessage} msg
     */
    send: async function(msg){
        try{
            this.socket.send(JSON.stringify(Object.assign({},msg,{id:"LOAD_CLIENT_ID", date: Date.now()})));
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




