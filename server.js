//env vars
const PORT = process.env.PORT || 8000
const DEV = process.env.DEV || true;

const path = require("path");

const mcpeping = require('mcpe-ping');
const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors({
    origin: ["http://localhost:8000","https://visualsource.000webhostapp.com/"],
}));
app.use(express.json());

app.get("/favicon.ico",(req,res)=>{
    res.sendFile(path.join(__dirname,"favicon.ico"));
});
app.get("/.well-known/acme-challenge/oAw_3Sz9Otg8Esqw1-EB7FK1HHm4eLLUnsw53aag7Ik",(req,res)=>{
    res.sendFile(path.join(__dirname,"vaild.txt"));
});

app.get('/', function (req, res) {
    mcpeping("35.209.27.81", 19132,(err,data)=>{
      if (err) {
        res.status(200).json({type:"error",  data:err});
     } else {
         res.status(200).json( {
             type:"info", 
             code: 200,
             data: {
                 players: [],
                 max_players: data.maxPlayers,
                 current_players: data.currentPlayers
             }, 
             msg:"returning data"
         });
     }
    },3000,false);
});

 
app.listen(PORT,"0.0.0.0");



//35.209.27.81