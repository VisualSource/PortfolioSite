//env vars
const PORT = process.env.PORT || 8000
const DEV = process.env.DEV || true;

const path = require("path");
const http = require("http");
const express = require('express');
const cors = require('cors')
const app = express();
const server = http.createServer(app);


app.use(express.static('public'));

const { Server } = require("socket.io");

const io = new Server(server);

io.on('connection', (socket) => {
    socket.on('chat message', msg => {
      io.emit('chat message', msg);
    });
});

app.use(cors());
app.use(express.json());

app.get("/socket.io/socket.io.js",(req,res)=>{
    res.sendFile(path.join(__dirname,"node_modules/socket.io/client-dist/socket.io.min.js"));
});
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname,"public","tests.html"));
});

server.listen(PORT,"0.0.0.0");
