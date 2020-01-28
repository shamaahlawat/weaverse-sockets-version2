import express from "express";
import SocketIO from "socket.io"
import http from "http"
import cors from 'cors'
import './db';
import {
    roomJoin,
    onMessage,
    onAuth,
    getRoom,
    workspaceRoomJoin,
    roomLeave
} from "./controller";
const app = express();
const server = http.Server(app);
//const io = SocketIO(server);
const io = require('socket.io')(server, { origins: '*:*'});
// const socket = SocketIO('http://localhost:3000', {transports: ['websocket', 'polling', 'flashsocket']})

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

const whitelist = ['http://localhost:3000'];
const corsOptions = {
  credentials: true,
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)
      callback(new Error('Not allowed by CORS'));
  }
}
app.use(cors(corsOptions));

// const allowCrossDomain = function(req, res, next) {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     // intercept OPTIONS method
//     if ('OPTIONS' == req.method) {
//       res.send(200);
//     }
//     else {
//       next();
//     }
// };

app.use(cors())
// app.use(allowCrossDomain);



const { PORT = 8080 } = process.env;
server.listen(PORT, () => console.log(`Chat Listening on port ${PORT}`)); // eslint-disable-line no-console

app.get("/", (req, res) => {
    res.send("Running")
    console.log(req)
})

io.on('connection', (socket) => {
    console.log('--------------------->connected', socket.id);
    //authenticate user 

    // socket.on('authentication', (userToken) => {
    //     console.log('---------------------->authentication', { userToken })
    //     onAuth(socket, io, userToken.token)
    // })

    // Workspace Join the room
    socket.on("workspace_room_join", (msg) => {
        console.log('------------------------->workspace_room_join', { msg })
        workspaceRoomJoin(socket, io, msg)
    })

    //get user room id
    socket.on("get_user_room", (msg) => {
        console.log('------------------------->get_user_room', { msg })
        getRoom(socket, io, msg)
    })


    // Join the room
    socket.on("room_join", (msg) => {
        console.log('------------------------->room_join', { msg })
        roomJoin(socket, io, msg)
    })
    // Join the room leave
    socket.on("room_leave", (msg) => {
        console.log('------------------------->room_leave', { msg })
        roomLeave(socket, io, msg)
    })
    // on message send
    socket.on("message", (msg) => {
        console.log('------------------------->message', { msg })
        onMessage(socket, io, msg)
    })

    socket.on('disconnect', () => {
        console.log('--------------------------->user disconnected', socket.id);
    });
});


// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmVkY2NkZTU4ZDAwN2E0NWNjOTI4OCIsImVtYWlsIjoicmF2aS5zaW5naDIwOTFAZ21haWwuY29tIiwiaWF0IjoxNTc1ODc1NzQ0LCJleHAiOjE1NzY0ODA1NDR9.nCVudQYHur4yjQXrBhED3rzmmd1LbXnfu-3IQhBbUuU


//  heroku logs --tail -a=weaverse-sockets --source app