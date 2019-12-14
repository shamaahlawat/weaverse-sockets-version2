import { Chat } from '../models';

export const onMessage = async (socket, io, msg) => {
    try {
        console.log({ msg });
        if (msg.token && msg.isChannel && msg.room_id && msg.workspace_id && msg.chat && msg.sender_id && msg.receiver_id) {
            if (msg.token != socket.id) {
                io.sockets.emit('message', { status: false, message: "Invalid/Missing token" });
                return
            }
            let chatData = {
                roomId: msg.room_id,
                channelId: msg.isChannel ? msg.room_id : undefined,
                workspaceId: msg.workspace_id,
                senderId: msg.sender_id,
                receiverId: msg.receiver_id,
                message: msg.chat,
                messageType: 'text',
                status: 'unseen',
                createdAt: new Date().toISOString()
            }
            console.log({ chatData })
            io.to(msg.room_id).emit("message", { status: true, chatData })
            delete (chatData.createdAt)
            await new Chat(chatData).save()
            return
        }
        io.sockets.emit('message', { status: false, message: "Invalid/Missing data" });
    } catch (error) {
        console.log(error)
    }
}