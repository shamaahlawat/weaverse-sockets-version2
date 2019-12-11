
import mongoose from '../db';

const RoomSchema = new mongoose.Schema(
    {
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
        workspaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Workspaces",
            required: true,
        },
    }, { timestamps: true });






var Room = module.exports = mongoose.model('Rooms', RoomSchema);
