import { Chat } from '../models';

export const onMessage = async (socket, io, msg) => {
    try {
        if (msg.room_id && msg.workspace_id && msg.chat && msg.sender_id && msg.receiver_id) {
            // msg.token && 
            // if (msg.token != socket.id) {
            //     io.to(msg.room_id).emit('message', { status: false, message: "Invalid/Missing token" });
            //     console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing token" })
            //     return
            // }
            let chatData = {
                roomId: msg.room_id,
                workspaceId: msg.workspace_id,
                senderId: msg.sender_id,
                receiverId: msg.receiver_id,
                message: msg.chat,
                messageType: 'text',
                status: 'unseen',
                createdAt: new Date().toISOString()
            }

            io.to(msg.room_id).emit("message", { status: true, chatData })
            console.log("----------------------> after emmit message", { status: true, chatData })
            delete (chatData.createdAt)
            await new Chat(chatData).save()
            return
        } else {
            io.to(msg.room_id).emit('message', { status: false, message: "Invalid/Missing data" });
            console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing data" })
        }

    } catch (error) {
        console.log(error)
    }
}