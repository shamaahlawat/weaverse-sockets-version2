export const onMessage = (socket, io, msg) => {
    if (msg.token != socket.id) {
        io.sockets.emit('message', { status: false, message: "Invalid/Missing token" });
        return
    }
    io.to(msg.room_id).emit("message", msg.chat)
}