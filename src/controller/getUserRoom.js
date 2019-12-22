import { Room } from '../models';

export const getRoom = async (socket, io, data) => {
    try {
        if (data.sender_id && data.receiver_id && data.workspace_id) {
            if (data.token != socket.id) {
                io.sockets.emit('get_user_room', { status: false, message: "Invalid/Missing token" });
                console.log("----------------------> after emmit get_user_room", { status: false, message: "Invalid/Missing token" })
                return
            }
            var roomCriteria = {
                $or: [{
                    $and: [{
                        "senderId": data.sender_id
                    }, {
                        "receiverId": data.receiver_id
                    }]
                }, {
                    $and: [{
                        "receiverId": data.sender_id
                    }, {
                        "senderId": data.receiver_id
                    }]
                }]
            }
            let room = await Room.findOne(roomCriteria)
            if (room) {
                io.sockets.emit('get_user_room', { status: true, room_id: room._id });
                console.log("----------------------> after emmit get_user_room", { status: true, room_id: room._id })

                return
            }

            let roomjson = new Room({
                "senderId": data.sender_id,
                "receiverId": data.receiver_id,
                "workspaceId": data.workspace_id,
            });

            await roomjson.save();
            io.sockets.emit('get_user_room', { status: true, room_id: roomjson._id });
            console.log("----------------------> after emmit get_user_room", { status: true, room_id: roomjson._id })
            return
        }
        io.sockets.emit('get_user_room', { status: false, message: "Invalid/Missing data" });
        console.log("----------------------> after emmit get_user_room", { status: false, message: "Invalid/Missing data" })
    } catch (error) {
        console.log(error)
    }
}