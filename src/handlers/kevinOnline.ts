import {Socket, Server} from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
const games = {};
const users = {};
export default function(socket: Socket, io: Server){

    function KevinEmit(room: string, event: string, data: any){
        io.of("/kevin").to(room).emit(event, data);
    }

    socket.on("new_game",(settings)=>{
        const roomId = uuidv4();
          games[roomId] = {
              settings,
              users: {}
          }
        socket.join(roomId);
        users[socket.id] = roomId;
        KevinEmit(roomId,"new_game",{room: roomId});
     });
  
     socket.on("join_game",(data)=>{
         if(games[data.uuid] && Object.keys(games[data.uuid].users).length < 2 ){
          const other = Object.keys(games[data.uuid].users).find(id => id !== data.id);
          users[socket.id] = data.id;
          socket.join(data.uuid);
          socket.emit("opponent_init",{ data: games[data.uuid].users[other], id: other, room: data.room});
         }else{
          socket.emit("game_full");
         }
        
     });
  
     socket.on("init",(data)=>{
         if(data.id && data.room){
          const room = games[data.room];
          room.users[data.id] = data.data;
          socket.broadcast.to(data.room).emit("opponent_init",data);
         }
     });
     // fix '.users[socket.id]'
     socket.on("disconnect",()=>{
         socket.leaveAll();
         delete games[users[socket.id]].users[socket.id];
         if(Object.keys(games[users[socket.id]].users).length === 0) delete games[users[socket.id]];
         delete users[socket.id];
     });
  
     socket.on("status_opponent",(data)=>{
         games[data.room].users[data.id].status = data.status;
        socket.broadcast.to(data.room).emit("status_opponent", games[data.room].users[data.id].status);
     });
  
     socket.on("kick",(data)=>{
          delete games[data.room].users[data.user];
          delete users[data.user];
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