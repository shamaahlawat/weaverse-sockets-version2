import { Chat, ChannelChat, User } from '../models';

export const onMessage = async (socket, io, msg) => {
    try {
        if (msg.room_id && msg.workspace_id && msg.chat && msg.sender_id && msg.receiver_id && !msg.isChannel) {
            // msg.token && 
            // if (msg.token != socket.id) {
            //     io.to(msg.room_id).emit('message', { status: false, message: "Invalid/Missing token" });
            //     console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing token" })
            //     return
            // }
            var criteria = {
                workspaceId: msg.workspace_id,
                $or: [{
                    $and: [{
                        "senderId": msg.sender_id
                    }, {
                        "receiverId": msg.receiver_id
                    }]
                }, {
                    $and: [{
                        "receiverId": msg.sender_id
                    }, {
                        "senderId": msg.receiver_id
                    }]
                }]
            }
            let chat = await Chat.findOne(criteria)
                .populate([
                    {
                        path: "receiverId",
                        select: 'firstName lastName picture'
                    },
                    {
                        path: "senderId",
                        select: 'firstName lastName picture'
                    },
                ])
            let chatData = {
                senderId: chat && chat.receiverId,
                receiverId: chat && chat.senderId,
                roomId: msg.room_id,
                workspaceId: msg.workspace_id,
                // senderId: msg.sender_id,
                // receiverId: msg.receiver_id,
                message: msg.chat,
                messageType: 'text',
                status: 'unseen',
                createdAt: new Date().toISOString()
            }
            let chatData1 = {
                roomId: msg.room_id,
                workspaceId: msg.workspace_id,
                senderId: msg.sender_id,
                receiverId: msg.receiver_id,
                message: msg.chat,
                messageType: 'text',
                status: 'unseen',
                createdAt: new Date().toISOString()
            }
            io.in(msg.room_id).emit("message", { status: true, chatData })
            console.log("----------------------> after emmit message", { status: true, chatData })
            delete (chatData1.createdAt)
            var myData = new Chat(chatData1);
            //   myData.save()
            let data = await myData.save()
            console.log("lksjdfljsdf", data)
            return
        } else {
            if (msg.isChannel) {
                var criteria = {
                    workspaceId: msg.workspace_id,
                    senderId: msg.sender_id

                }
                let ChannelChatData = await User.findOne({ _id: msg.sender_id })
                // .populate([
                //     {
                //         path: "senderId",
                //         select: 'firstName lastName picture'
                //     },
                // ])
                console.log("ChannelChatData=============", ChannelChatData)
                const { firstName, lastName, email, phone } = ChannelChatData
                let userdata = { ...msg, firstName, lastName, email, phone, messageType: "text", message: msg.chat }
                io.in(msg.room_id).emit("message", { status: true, chatData: userdata })
                let chatData1 = {
                    roomId: msg.room_id,
                    workspaceId: msg.workspace_id,
                    senderId: msg.sender_id,
                    message: msg.chat,
                    messageType: 'text',
                    status: 'unseen',
                    createdAt: new Date().toISOString()
                }
                delete (chatData1.createdAt)
                var myData = new Chat(chatData1);
                //   myData.save()
                let data = await myData.save()
                return
            }
            socket.emit('message', { status: false, message: "Invalid/Missing data" });
            console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing data" })
        }

    } catch (error) {
        console.log(error)
    }
}