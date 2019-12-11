
import mongoose from '../db';

const ChatSchema = new mongoose.Schema(
    {
        roomId: {
            type: String,
            required: true,
            trim: true
        },
        channelId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Channel",
        },
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspaces",
            required: true,
        },
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        receiverId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },
        message: {
            type: String,
            trim: true
        },
        image: {
            type: String,
        },
        messageType: {
            type: String,
            enum: ['text', 'file'],
            default: 'text'
        },
        status: {
            type: String,
            enum: ['seen', 'unseen'],
            default: 'seen'
        }
    }, { timestamps: true });






var Chat = module.exports = mongoose.model('Chats', ChatSchema);
