import {Socket, Server} from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
const games: { [room_id: string]:{
    settings: {},
    users: {}
}} = {};
const client_socket: {[client_id: string]: string} = {};
export default function(socket: Socket, io: Server){

    function getClientId(id: string): string{
        return Object.keys(client_socket).find(data=>client_socket[data] === id);
    }
    function createGame(settings: {}): string{
        const roomId = uuidv4();
        games[roomId] = {
            settings,
            users: {}
        }
        return roomId;
    }
    socket.on("login",(data)=>{
        client_socket[data.id] = socket.id;
    });
    socket.on("disconnect",()=>{
        //@ts-ignore
        if(games[socket.inGameRoom]) {
            //@ts-ignore
            delete games[socket.inGameRoom].users[getClientId(socket.id)];
            //@ts-ignore
            if(Object.keys(games[socket.inGameRoom].users).length === 0) delete games[socket.inGameRoom];
        }
        //@ts-ignore
        socket.inGameRoom = null;
        socket.leaveAll();
    });
    socket.on("new_game",(settings)=>{
        const game = createGame(settings);
        socket.join(game);
        //@ts-ignore
        socket.inGameRoom = game;
        io.of("/kevin").to(game).emit("new_game",{room: game});
     });
     socket.on("init",(data)=>{
        if(data.id && data.room){
         const room = games[data.room];
         room.users[getClientId(data.id)] = data.data;
         socket.broadcast.to(data.room).emit("opponent_init",data);
        }
    });
    socket.on("join_game",(data)=>{
        if(games[data.uuid] && Object.keys(games[data.uuid].users).length < 2 ){
         const other = Object.keys(games[data.uuid].users).find(id => id !== data.id);
         //@ts-ignore
         socket.inGameRoom = data.id;
         socket.join(data.uuid);
         socket.emit("opponent_init",{ data: games[data.uuid].users[other], id: other, room: data.room});
        }else{
         socket.emit("game_full");
        }
       
    });
    socket.on("status_opponent",(data)=>{
        games[data.room].users[getClientId(data.id)].status = data.status;
       socket.broadcast.to(data.room).emit("status_opponent", games[data.room].users[getClientId(data.id)].status);
    });
    socket.on("kick",(data)=>{
        delete games[data.room].users[getClientId(data.user)];
        //@ts-ignore
        socket.inGameRoom = null;
        socket.broadcast.to(data.room).emit("kick", {user: data.user});
    });
    socket.on("self_kicked",(data)=>{
     socket.leave(data.room);
    });
    socket.on("game_start",(data)=>{
        socket.broadcast.to(data.room).emit("game_start",{ host_start: true });
    });
    socket.on("request_deck",(data)=>{
        socket.broadcast.to(data.room).emit("send_deck");
    });
    socket.on("send_deck",(data)=>{
       socket.broadcast.to(data.room).emit("request_deck",{ deck: data.deck});
    });
}


