export const roomJoin = (socket, io, msg) => {
    if (msg.room_id) {
        // msg.token && 
        // if (msg.token != socket.id) {
        //     io.sockets.emit('room_join', { status: false, message: "Invalid/Missing token" });
        //     console.log("----------------------> after emmit room_join", { status: false, message: "Invalid/Missing token" })
        //     return
        // }

        socket.join(msg.room_id, () => {
            io.in(msg.room_id).emit("room_join", { status: true, msg: "room join", room_id: msg.room_id })
            console.log("----------------------> after emmit room_join", { status: true, msg: "room join", room_id: msg.room_id })
            return
        })

    } else {
        socket.emit('room_join', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit room_join", { status: false, message: "Invalid/Missing data" })
    }
}
export const roomJoin1 = (socket, io, data) => {
    const { room_ids = [] } = data
    if (room_ids.length) {
        for (const i in room_ids) {
            socket.join(room_ids[i], () => {
                io.in(room_ids[i]).emit("room_join", { status: true, msg: "room join", room_id: room_ids[i] })
                console.log("----------------------> after emmit room_join", { status: true, msg: "room join", room_id: room_ids[i] })
                return
            })

        }

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
            io.in(msg.room_id).emit("room_leave", { status: true, msg: "room leave", room_id: msg.room_id })
            console.log("----------------------> after emmit room_leave", { status: true, msg: "room leave", room_id: msg.room_id })
            return
        })
    } else {
        socket.emit('room_leave', { status: false, message: "Invalid/Missing data" });
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
            io.in(msg.workspace_id).emit("workspace_room_join", { status: true, msg: "Workspace room join" })
            console.log("----------------------> after emmit workspace_room_join", { status: true, msg: "Workspace room join" })
            return
        })
    } else {
        socket.emit('workspace_room_join', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit workspace_room_join", { status: false, message: "Invalid/Missing data" })
    }


} 