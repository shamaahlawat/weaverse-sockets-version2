
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
        seenUserId: [{
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Users'
            }
        }]

    }, { timestamps: true });






var ChannelChat = module.exports = mongoose.model('ChannelChats', ChatSchema);
