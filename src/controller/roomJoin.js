export const roomJoin = (socket, io, msg) => {
    socket.join(msg.room_id, () => {
        io.to(msg.room_id).emit("room_join", { msg: "room join", room_id: msg.room_id, userId: msg.userId })
    })

} 