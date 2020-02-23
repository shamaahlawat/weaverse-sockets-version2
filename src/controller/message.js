import { Chat, User } from '../models';

const AWS = require('aws-sdk');
import CONFIG from '../config';

const s3Bucket = new AWS.S3({
    accessKeyId: CONFIG.AWS_ACCESS_KEY,
    secretAccessKey: CONFIG.AWS_SECRET_ACCESS
});
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
            let ChannelChatData = await User.findOne({ _id: msg.sender_id })
            if (msg.msgType === "file") {
                let buf = new Buffer(msg.chat.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                var uploadData = {
                    Bucket: 'weaversefile',
                    Key: `${Date.now()}RI${msg.room_id}UI${msg.sender_id}F${msg.fileName}`,
                    Body: buf,
                    ContentEncoding: 'base64',
                    ContentType: msg.fileType
                };
                s3Bucket.upload(uploadData, async function (err, resp) {
                    if (err) {
                        console.log(err);
                        console.log('Error uploading data: ', resp);
                    } else {
                        let chatUploadData = {
                            senderId: ChannelChatData,
                            receiverId: chat && chat.receiverId,
                            roomId: msg.room_id,
                            workspaceId: msg.workspace_id,
                            message: resp.Location,
                            messageType: msg.msgType,
                            fileType: msg.fileType,
                            status: 'unseen',
                            createdAt: new Date().toISOString()
                        }
                        let uploadchatData1 = {
                            roomId: msg.room_id,
                            workspaceId: msg.workspace_id,
                            senderId: msg.sender_id,
                            receiverId: msg.receiver_id,
                            message: resp.Location,
                            messageType: msg.msgType,
                            fileType: msg.fileType,
                            status: 'unseen',
                            createdAt: new Date().toISOString()
                        }
                        io.in(msg.room_id).emit("message", { status: true, chatData: chatUploadData })
                        delete (uploadchatData1.createdAt)
                        const myData = new Chat(uploadchatData1);
                        //   myData.save()
                        let saveData = await myData.save()
                        console.log('succesfully uploaded the image!resp', saveData);
                        console.log('succesfully uploaded the image!', resp);
                    }
                });

                return
            }

            let chatData = {
                senderId: ChannelChatData,
                receiverId: chat && chat.receiverId,
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

                let ChannelChatData = await User.findOne({ _id: msg.sender_id })

                console.log("ChannelChatData=============", ChannelChatData)
                const { firstName, lastName, email, phone } = ChannelChatData
                if (msg.msgType === "file") {
                    let buf = new Buffer(msg.chat.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                    let channeluploadData = {
                        Bucket: 'weaversefile',
                        Key: `${Date.now()}RI${msg.room_id}UI${msg.sender_id}F${msg.fileName}`,
                        Body: buf,
                        ContentEncoding: 'base64',
                        ContentType: msg.fileType
                    };
                    s3Bucket.upload(channeluploadData, async function (err, resp) {
                        if (err) {
                            console.log(err);
                            console.log('Error uploading data: ', resp);
                        } else {
                            let userdata = {
                                ...msg,
                                firstName,
                                lastName, email, phone,
                                messageType: msg.msgType,
                                fileType: msg.fileType,
                                message: resp.Location
                            }
                            io.in(msg.room_id).emit("message", { status: true, chatData: userdata })
                            let chatData1 = {
                                roomId: msg.room_id,
                                workspaceId: msg.workspace_id,
                                senderId: msg.sender_id,
                                message: resp.Location,
                                messageType: msg.msgType,
                                fileType: msg.fileType,
                                status: 'unseen',
                                createdAt: new Date().toISOString()
                            }
                            delete (chatData1.createdAt)
                            let myDbData = new Chat(chatData1);
                            //   myData.save()
                            await myDbData.save()
                            console.log('succesfully uploaded the image!', resp);
                        }
                    });

                    return
                }
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
                let myDbData = new Chat(chatData1);
                //   myData.save()
                await myDbData.save()
                return
            }
            socket.emit('message', { status: false, message: "Invalid/Missing data" });
            console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing data" })
        }

    } catch (error) {
        console.log(error)
    }
}