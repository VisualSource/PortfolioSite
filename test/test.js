import {ws} from "./websocket.js"


const Post = async(path,params)=>{
    const response = await fetch(`http://localhost:8000/${path}`,{
      method: "POST",
      mode:"cors",
      body: JSON.stringify(params),
      headers:{
        'Content-Type':'application/json'
      }
    });
    return await response.json();
  }


window.Post = Post;
window.ws = ws;