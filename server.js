//env vars
const PORT = process.env.PORT || 8000
const DEV = process.env.DEV || true;

const mcpeping = require('mcpe-ping');
const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors({
    origin: ["http://localhost:3000","https://visualsource.000webhostapp.com/"],
}));
app.use(express.json());

app.get('/', function (req, res) {
    mcpeping("135.148.9.125", 19132,(err,data)=>{
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