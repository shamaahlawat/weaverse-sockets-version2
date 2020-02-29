
import mongoose from '../db';

const ChatSchema = new mongoose.Schema(
    {
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            trim: true
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
            required: false,
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
        fileType: {
            type: String,
            default: 'text'
        },
        fileName: {
            type: String,
            default: 'text'
        },
        status: {
            type: String,
            enum: ['seen', 'unseen'],
            default: 'seen'
        }
    }, { timestamps: true });






var Chat = module.exports = mongoose.model('Chats', ChatSchema);
