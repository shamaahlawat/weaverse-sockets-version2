import express from "express";
import SocketIO from "socket.io"
import http from "http"

import './db';
import { roomJoin, onMessage } from "./controller";


const app = express();
const server = http.Server(app);
const io = SocketIO(server);

const { PORT = 8080 } = process.env;
server.listen(PORT, () => console.log(`Chat Listening on port ${PORT}`)); // eslint-disable-line no-console


io.on('connection', (socket) => {
    socket.user = true
    console.log('connected', socket.id);

    // Join the room
    socket.on("room_join", (msg) => {
        roomJoin(socket, io, msg)
    })
    // on message send
    socket.on("message", (msg) => {
        onMessage(socket, io, msg)
    })

    socket.on('disconnect', () => {
        console.log('user disconnected', socket.id, socket.user);
    });
});