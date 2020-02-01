'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.onAuth = undefined;

var _jwt = require('../utils/jwt');

var _models = require('../models');

const INVALID_TOKEN = 'Invalid/Missing token';

const onAuth = exports.onAuth = async (socket, io, token) => {
    try {
        if (!token) {
            io.sockets.emit('authentication', { status: false, message: INVALID_TOKEN });
            console.log("---------------------> after emmit authentication", { status: false, message: INVALID_TOKEN });
            return;
        }
        const decoded = await (0, _jwt.decodeJWT)({ token });
        if (!decoded.id) {
            io.sockets.emit('authentication', { status: false, message: INVALID_TOKEN });
            console.log("---------------------> after emmit authentication", { status: false, message: INVALID_TOKEN });
            return;
        }
        const user = await _models.User.findOne({ email: decoded.email });
        if (!user) {
            io.sockets.emit('authentication', { status: false, message: 'User not found' });
            console.log("---------------------> after emmit authentication", { status: false, message: 'User not found' });
            return;
        }
        socket.user = user;
        io.sockets.emit('authentication', { status: true, message: 'User found', socket_token: socket.id });
        console.log("---------------------> after emmit authentication", { status: true, message: 'User found', socket_token: socket.id });
        return;
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            io.sockets.emit('authentication', { status: false, message: 'Token expired' });
            return;
        } else if (err.name === 'JsonWebTokenError') {
            io.sockets.emit('authentication', { status: false, message: INVALID_TOKEN });
            return;
        }
        io.sockets.emit('authentication', { status: false, message: "Something went wrong" });
        return;
    }
};
//# sourceMappingURL=auth.js.map