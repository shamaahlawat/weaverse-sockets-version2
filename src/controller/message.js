import { Room } from '../models';

export const onMessage = async (socket, io, msg) => {
    if (!msg.token && !msg.room_id && !msg.workspace_id && !msg.chat && !msg.sender_id && !msg.receiver_id) {
        if (msg.token != socket.id) {
            io.sockets.emit('message', { status: false, message: "Invalid/Missing token" });
            return
        }

        io.to(msg.room_id).emit("message", msg.chat)

    }
}