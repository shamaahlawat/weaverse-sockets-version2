import express from "express";
import SocketIO from "socket.io";
import http from "http";
import cors from "cors";
import { notify } from "./controller/notify";
import { Workspace, User, Token } from "./models";
import "./db";
import {
    roomJoin,
    roomJoin1,
    onMessage,
    onAuth,
    getRoom,
    workspaceRoomJoin,
    roomLeave
} from "./controller";

const app = express();
const server = http.Server(app);
const io = SocketIO(server);
app.use(cors());

const { PORT = 8080 } = process.env;
server.listen(PORT, () => console.log(`Chat Listening on port ${PORT}`)); // eslint-disable-line no-console

app.get("/", (req, res) => {
    res.send("Running");
    console.log(req);
});

io.on("connection", socket => {
    console.log("--------------------->connected", socket.id);
    //authenticate user

    // socket.on('authentication', (userToken) => {
    //     console.log('---------------------->authentication', { userToken })
    //     onAuth(socket, io, userToken.token)
    // })

    // Workspace Join the room
    socket.on("workspace_room_join", msg => {
        // console.log('------------------------->workspace_room_join', { msg })
        workspaceRoomJoin(socket, io, msg);
    });

    //get user room id
    socket.on("get_user_room", msg => {
        // console.log('------------------------->get_user_room', { msg })
        getRoom(socket, io, msg);
    });

    // Join the room
    socket.on("room_join", msg => {
        // console.log('------------------------->room_join', { msg })
        roomJoin(socket, io, msg);
    });

    // Join the room
    socket.on("room_join1", msg => {
        // console.log('------------------------->room_join', msg)
        roomJoin1(socket, io, msg);
    });
    // Join the room leave
    socket.on("room_leave", msg => {
        // console.log('------------------------->room_leave', { msg })
        roomLeave(socket, io, msg);
    });
    // on message send
    socket.on("message", async msg => {
        onMessage(socket, io, msg);

        let user_token = await Token.findOne({
            userId: msg.receiver_id
        });

        let user_reciver = await User.findOne({
            _id: msg.sender_id
        });

        if (user_token) {
            await notify(user_token.fcmtoken, {
                title: "weaverse",
                body: `${user_reciver.firstName} ${
                    user_reciver.lastName
                } sent you a personal message: ${msg.chat}`,
                icon: "https://res.cloudinary.com/dlwatmwd3/image/upload/v1587121530/Vyorius/weaverse-webapp/img/weaverse_design_1_1.png",
                type: `${receiver_id}`
            });
        }
    });

    socket.on("disconnect", () => {
        // console.log('--------------------------->user disconnected', socket.id);
    });
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmVkY2NkZTU4ZDAwN2E0NWNjOTI4OCIsImVtYWlsIjoicmF2aS5zaW5naDIwOTFAZ21haWwuY29tIiwiaWF0IjoxNTc1ODc1NzQ0LCJleHAiOjE1NzY0ODA1NDR9.nCVudQYHur4yjQXrBhED3rzmmd1LbXnfu-3IQhBbUuU

//  heroku logs --tail -a=weaverse-sockets --source app