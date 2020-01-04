export const roomJoin = (socket, io, msg) => {
    if (msg.room_id) {
        // msg.token && 
        // if (msg.token != socket.id) {
        //     io.sockets.emit('room_join', { status: false, message: "Invalid/Missing token" });
        //     console.log("----------------------> after emmit room_join", { status: false, message: "Invalid/Missing token" })
        //     return
        // }

        socket.join(msg.room_id, () => {
            socket.to(msg.room_id).emit("room_join", { status: true, msg: "room join", room_id: msg.room_id })
            console.log("----------------------> after emmit room_join", { status: true, msg: "room join", room_id: msg.room_id })
            return
        })

    } else {
        socket.sockets.emit('room_join', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit room_join", { status: false, message: "Invalid/Missing data" })
    }
}

export const roomLeave = (socket, io, msg) => {
    if (msg.room_id) {
        // msg.token && 
        // if (msg.token != socket.id) {
        //     io.sockets.emit('room_leave', { status: false, message: "Invalid/Missing token" });
        //     console.log("----------------------> after emmit room_leave", { status: false, message: "Invalid/Missing token" })
        //     return
        // }

        socket.leave(msg.room_id, () => {
            socket.to(msg.room_id).emit("room_leave", { status: true, msg: "room leave", room_id: msg.room_id })
            console.log("----------------------> after emmit room_leave", { status: true, msg: "room leave", room_id: msg.room_id })
            return
        })
    } else {
        socket.sockets.emit('room_leave', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit room_leave", { status: false, message: "Invalid/Missing data" })
    }

}

export const workspaceRoomJoin = (socket, io, msg) => {

    if (msg.workspace_id) {
        // msg.token &&
        // if (msg.token != socket.id) {
        //     io.sockets.emit('workspace_room_join', { status: false, message: "Invalid/Missing token" });
        //     console.log("----------------------> after emmit workspace_room_join", { status: false, message: "Invalid/Missing token" })
        //     return
        // }

        socket.join(msg.workspace_id, () => {
            socket.to(msg.workspace_id).emit("workspace_room_join", { status: true, msg: "Workspace room join" })
            console.log("----------------------> after emmit workspace_room_join", { status: true, msg: "Workspace room join" })
            return
        })
    } else {
        socket.sockets.emit('workspace_room_join', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit workspace_room_join", { status: false, message: "Invalid/Missing data" })
    }


} 