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
                // let buf = new Buffer.from(msg.chat.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                var uploadData = {
                    Bucket: 'weaversefile',
                    // Key: `${Date.now()}RI${msg.room_id}UI${msg.sender_id}F${msg.fileName}`,
                    Key: `${Date.now()}${msg.fileName}`,
                    Body: msg.chat,
                    // ContentEncoding: 'base64',
                    // ContentType: msg.fileType
                };
                s3Bucket.upload(uploadData, async function (err, resp) {
                    if (err) {
                        console.log(err);
                        console.log('Error uploading data: ', resp);
                    } else {

                        let uploadchatData1 = {
                            roomId: msg.room_id,
                            workspaceId: msg.workspace_id,
                            senderId: msg.sender_id,
                            receiverId: msg.receiver_id,
                            message: resp.Location,
                            messageType: msg.msgType,
                            fileType: msg.fileType,
                            fileName: msg.fileName,
                            fileSize: msg.fileSize,
                            status: 'unseen',
                            createdAt: new Date().toISOString()
                        }

                        // delete (uploadchatData1.createdAt)
                        const myData = new Chat(uploadchatData1);
                        let saveData = await myData.save()
                        let chatUploadData = {
                            senderId: ChannelChatData,
                            receiverId: chat && chat.receiverId,
                            roomId: msg.room_id,
                            workspaceId: msg.workspace_id,
                            message: resp.Location,
                            messageType: msg.msgType,
                            fileType: msg.fileType,
                            fileName: msg.fileName,
                            fileSize: msg.fileSize,
                            status: 'unseen',
                            createdAt: new Date().toISOString(),
                            message_id: saveData._id

                        }
                        //   myData.save()

                        io.in(msg.room_id).emit("message", { status: true, chatData: chatUploadData })
                        console.log('succesfully uploaded the image!resp', saveData);
                        console.log('succesfully uploaded the image!', resp);
                    }
                });

                return
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

            // delete (chatData1.createdAt)
            var myData = new Chat(chatData1);
            //   myData.save()
            let saveMsgData = await myData.save()
            console.log("lksjdfljsdf", saveMsgData)
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
                createdAt: new Date().toISOString(),
                message_id: saveMsgData._id
            }
            io.in(msg.room_id).emit("message", { status: true, chatData })
            console.log("----------------------> after emmit message", { status: true, chatData })
            return
        } else {
            if (msg.isChannel) {

                let ChannelChatData = await User.findOne({ _id: msg.sender_id })

                const { firstName, lastName, email, phone, picture } = ChannelChatData
                if (msg.msgType === "file") {
                    // let buf = new Buffer(msg.chat.replace(/^data:image\/\w+;base64,/, ""), 'base64')
                    let channeluploadData = {
                        Bucket: 'weaversefile',
                        // Key: `${Date.now()}RI${msg.room_id}UI${msg.sender_id}F${msg.fileName}`,
                        Key: `${Date.now()}${msg.fileName}`,
                        Body: msg.chat,
                        // Body: buf,
                        // ContentEncoding: 'base64',
                        // ContentType: msg.fileType
                    };
                    s3Bucket.upload(channeluploadData, async function (err, resp) {
                        if (err) {
                            console.log(err);
                            console.log('Error uploading data: ', resp);
                        } else {


                            let chatData1 = {
                                roomId: msg.room_id,
                                workspaceId: msg.workspace_id,
                                senderId: msg.sender_id,
                                message: resp.Location,
                                messageType: msg.msgType,
                                fileType: msg.fileType,
                                fileName: msg.fileName,
                                fileSize: msg.fileSize,
                                msgSeenBy: [msg.sender_id],
                                status: 'unseen',
                                createdAt: new Date().toISOString()
                            }
                            // delete (chatData1.createdAt)
                            let mycDbData = new Chat(chatData1);
                            //   myData.save()
                            let finalchanneldata = await mycDbData.save()
                            delete msg.chat
                            let userdata = {
                                ...msg,
                                firstName,
                                lastName, email, phone, picture,
                                messageType: msg.msgType,
                                fileType: msg.fileType,
                                fileName: msg.fileName,
                                fileSize: msg.fileSize,
                                message: resp.Location,
                                msgSeenBy: [msg.sender_id],
                                message_id: finalchanneldata._id
                            }
                            console.log("userdata", userdata, finalchanneldata)
                            if (finalchanneldata._id) {

                                io.in(msg.room_id).emit("message", { status: true, chatData: userdata })
                            }
                            console.log('succesfully uploaded the image!', resp);
                        }
                    });

                    return
                }
                let chatData1 = {
                    roomId: msg.room_id,
                    workspaceId: msg.workspace_id,
                    senderId: msg.sender_id,
                    message: msg.chat,
                    messageType: 'text',
                    status: 'unseen',
                    msgSeenBy: [msg.sender_id],
                    createdAt: new Date().toISOString()
                }
                // delete (chatData1.createdAt)
                let myDbData = new Chat(chatData1);
                //   myData.save()
                let finaldata = await myDbData.save()
                console.log("ChannelChatData=============", finaldata)
                let userdata = {
                    ...msg, message_id: finaldata._id,
                    msgSeenBy: [msg.sender_id], firstName, lastName, email, phone, picture, messageType: "text", message: msg.chat
                }
                io.in(msg.room_id).emit("message", { status: true, chatData: userdata })


                return
            }
            socket.emit('message', { status: false, message: "Invalid/Missing data" });
            console.log("----------------------> after emmit message", { status: false, message: "Invalid/Missing data" })
        }

    } catch (error) {
        console.log(error)
    }
}