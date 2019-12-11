export const roomJoin = (socket, io, msg) => {
    if (!msg.token && !msg.room_id) {
        if (msg.token != socket.id) {
            io.sockets.emit('room_join', { status: false, message: "Invalid/Missing token" });
            return
        }

        socket.join(msg.room_id, () => {
            io.to(msg.room_id).emit("room_join", { msg: "room join", room_id: msg.room_id, userId: msg.userId })
        })
    }
}
export const workspaceRoomJoin = (socket, io, msg) => {

    if (!msg.token && !msg.workspace_id) {
        if (msg.token != socket.id) {
            io.sockets.emit('workspace_room_join', { status: false, message: "Invalid/Missing token" });
            return
        }

        socket.join(msg.workspace_id, () => {
            io.to(msg.workspace_id).emit("workspace_room_join", { msg: "Workspace room join" })
        })
    }


} 