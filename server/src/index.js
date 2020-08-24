import dotenv from "dotenv";
import express from "express";
import http from "http";
import socket from "socket.io"
import { CONNECTION, LIMIT_USERS_BY_ROOM, JOIN_ROOM, JOIN_ROOM_RESPONSE, SENDING_SIGNAL, USER_JOINED, RETURNING_SIGNAL, DISCONNECT, RECEIVING_RETURNED_SIGNAL, USER_LEFT } from "./utils/constants";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socket(server);

const rooms = {};
const socketToRoom = {};

io.on(CONNECTION, socket => {
    socket.on(JOIN_ROOM, data => {
        if(rooms[data.roomID]===undefined){
            rooms[data.roomID] = {};
        }
        const length = rooms[data.roomID].length;
        if (length === LIMIT_USERS_BY_ROOM) {
            socket.emit(JOIN_ROOM_RESPONSE, "room full");
            return;
        }
        socket.emit(JOIN_ROOM_RESPONSE, rooms[data.roomID]);
        rooms[data.roomID][socket.id]={
            socketID: socket.id,
            "name": data.name+socket.id
        }
        socketToRoom[socket.id] = data.roomID;
        console.log(rooms);
    });

    socket.on(SENDING_SIGNAL, payload => {
        io.to(payload.userToSignal).emit(USER_JOINED, { signal: payload.signal, callerID: payload.callerID });
    });

    socket.on(RETURNING_SIGNAL, payload => {
        io.to(payload.callerID).emit(RECEIVING_RETURNED_SIGNAL, { signal: payload.signal, id: socket.id });
    });

    socket.on(DISCONNECT, () => {
        const roomID = socketToRoom[socket.id];
        let room = rooms[roomID];
        if (room) {
            for(let socketID in rooms[roomID]){
                if(socketID===socket.id) continue;
                io.to(socketID).emit(USER_LEFT,{
                    id: socket.id
                });
            }
            delete rooms[roomID][socket.id];
            delete socketToRoom[socket.id];
        }
    });

});

server.listen(process.env.PORT || 3001, () => console.log('server is running on port 3001'));