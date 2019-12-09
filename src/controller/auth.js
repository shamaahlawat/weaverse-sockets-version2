import { decodeJWT } from '../utils/jwt';
import { User } from '../models';

const INVALID_TOKEN = 'Invalid/Missing token';

export const onAuth = async (socket, io, token) => {
    try {
        if (!token) {
            io.sockets.emit('authentication', { status: false, message: INVALID_TOKEN });
            return
        }
        const decoded = await decodeJWT({ token });
        if (!decoded.id) {
            io.sockets.emit('authentication', { status: false, message: INVALID_TOKEN });
            return
        }
        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            io.sockets.emit('authentication', { status: false, message: 'User not found' });
            return
        }
        socket.user = user



        io.sockets.emit('authentication', { status: true, message: 'User found', token: socket.id });
        return
    } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            io.sockets.emit('authentication', { status: false, message: 'Token expired' });
            return
        } else if (err.name === 'JsonWebTokenError') {
            io.sockets.emit('authentication', { status: false, message: INVALID_TOKEN });
            return
        }
        io.sockets.emit('authentication', { status: false, message: "Something went wrong" });
        return
    }
}