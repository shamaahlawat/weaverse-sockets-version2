"use strict";

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _socket = require("socket.io");

var _socket2 = _interopRequireDefault(_socket);

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

require("./db");

var _controller = require("./controller");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
const server = _http2.default.Server(app);
const io = (0, _socket2.default)(server);
app.use((0, _cors2.default)());

const { PORT = 8080 } = process.env;
server.listen(PORT, () => console.log(`Chat Listening on port ${PORT}`)); // eslint-disable-line no-console

app.get("/", (req, res) => {
    res.send("Running");
    console.log(req);
});

io.on('connection', socket => {
    console.log('--------------------->connected', socket.id);
    //authenticate user 

    // socket.on('authentication', (userToken) => {
    //     console.log('---------------------->authentication', { userToken })
    //     onAuth(socket, io, userToken.token)
    // })

    // Workspace Join the room
    socket.on("workspace_room_join", msg => {
        console.log('------------------------->workspace_room_join', { msg });
        (0, _controller.workspaceRoomJoin)(socket, io, msg);
    });

    //get user room id
    socket.on("get_user_room", msg => {
        console.log('------------------------->get_user_room', { msg });
        (0, _controller.getRoom)(socket, io, msg);
    });

    // Join the room
    socket.on("room_join", msg => {
        console.log('------------------------->room_join', { msg });
        (0, _controller.roomJoin)(socket, io, msg);
    });
    // Join the room leave
    socket.on("room_leave", msg => {
        console.log('------------------------->room_leave', { msg });
        (0, _controller.roomLeave)(socket, io, msg);
    });
    // on message send
    socket.on("message", msg => {
        console.log('------------------------->message', { msg });
        (0, _controller.onMessage)(socket, io, msg);
    });

    socket.on('disconnect', () => {
        console.log('--------------------------->user disconnected', socket.id);
    });
});

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVkYmVkY2NkZTU4ZDAwN2E0NWNjOTI4OCIsImVtYWlsIjoicmF2aS5zaW5naDIwOTFAZ21haWwuY29tIiwiaWF0IjoxNTc1ODc1NzQ0LCJleHAiOjE1NzY0ODA1NDR9.nCVudQYHur4yjQXrBhED3rzmmd1LbXnfu-3IQhBbUuU


//  heroku logs --tail -a=weaverse-sockets --source app
//# sourceMappingURL=index.js.map