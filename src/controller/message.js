import { Chat, ChannelChat, Workspace, User, Channel, Token } from "../models";
import { notify } from "./notify";
export const onMessage = async(socket, io, msg) => {
    try {
        if (
            msg.room_id &&
            msg.workspace_id &&
            msg.chat &&
            msg.sender_id &&
            msg.receiver_id &&
            !msg.isChannel
        ) {
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
                                senderId: msg.sender_id
                            },
                            {
                                receiverId: msg.receiver_id
                            }
                        ]
                    },
                    {
                        $and: [{
                                receiverId: msg.sender_id
                            },
                            {
                                senderId: msg.receiver_id
                            }
                        ]
                    }
                ]
            };
            let chat = await Chat.findOne(criteria).populate([{
                    path: "receiverId",
                    select: "firstName lastName picture"
                },
                {
                    path: "senderId",
                    select: "firstName lastName picture"
                }
            ]);
            let chatData = {
                senderId: chat && chat.senderId,
                receiverId: chat && chat.receiverId,
                roomId: msg.room_id,
                workspaceId: msg.workspace_id,
                // senderId: msg.sender_id,
                // receiverId: msg.receiver_id,
                message: msg.chat,
                messageType: "text",
                status: "unseen",
                createdAt: new Date().toISOString()
            };
            let chatData1 = {
                roomId: msg.room_id,
                workspaceId: msg.workspace_id,
                senderId: msg.sender_id,
                receiverId: msg.receiver_id,
                message: msg.chat,
                messageType: "text",
                status: "unseen",
                createdAt: new Date().toISOString()
            };
            io.in(msg.room_id).emit("message", { status: true, chatData });
            console.log("----------------------> after emmit message", {
                status: true,
                chatData
            });
            delete chatData1.createdAt;
            var myData = new Chat(chatData1);
            //   myData.save()
            let data = await myData.save();
            console.log("lksjdfljsdf", data);
            return;
        } else {
            if (msg.isChannel) {
                var criteria = {
                    workspaceId: msg.workspace_id,
                    senderId: msg.sender_id
                };
                var channel_data = await Channel.findOne({
                    _id: msg.room_id
                });
                var user = await User.findOne({
                    _id: msg.sender_id
                });
                var workspace = await Workspace.findOne({
                    _id: msg.workspace_id
                });
                var user_ids = JSON.parse(JSON.stringify(channel_data))
                    .memberList;

                if (user_ids.length > 0) {
                    for (let index = 0; index < user_ids.length; index++) {
                        const ids = user_ids[index];
                        if (msg.sender_id != ids) {
                            let user_token = await Token.findOne({
                                userId: ids
                            });
                            if (user_token) {
                                await notify(user_token.fcmtoken, {
                                    title: "weaverse",
                                    body: `${user.firstName} ${
                                        user.lastName
                                    } sent you a ${msg.chat} in ${
                                        channel_data.name
                                    } channel (${workspace.name} workspace)`,
                                    icon: "https://res.cloudinary.com/dlwatmwd3/image/upload/v1587121530/Vyorius/weaverse-webapp/img/weaverse_design_1_1.png",
                                    type: "groupmessage"
                                });
                            }
                        }
                    }
                }

                //  console.log("sdfsdfsdf")

                // .populate([
                //     {
                //         path: "senderId",
                //         select: 'firstName lastName picture'
                //     },
                // ])
                // console.log("ChannelChatData=============", msg);
                let ChannelChatData = await User.findOne({
                    _id: msg.sender_id
                });
                const { firstName, lastName, email, phone } = ChannelChatData;
                let userdata = {
                    ...msg,
                    firstName,
                    lastName,
                    email,
                    phone,
                    messageType: "text",
                    message: msg.chat
                };
                io.in(msg.room_id).emit("message", {
                    status: true,
                    chatData: userdata
                });
                let chatData1 = {
                    roomId: msg.room_id,
                    workspaceId: msg.workspace_id,
                    senderId: msg.sender_id,
                    message: msg.chat,
                    messageType: "text",
                    status: "unseen",
                    createdAt: new Date().toISOString()
                };
                delete chatData1.createdAt;
                var myData = new Chat(chatData1);
                //   myData.save()
                let data = await myData.save();
                return;
            }
            socket.emit("message", {
                status: false,
                message: "Invalid/Missing data"
            });
            // console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing data" })
        }
    } catch (error) {
        console.log(error);
    }
};