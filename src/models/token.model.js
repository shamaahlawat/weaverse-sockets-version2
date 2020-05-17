import mongoose from "../db";
const TokenSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    fcmtoken: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

var Token = (module.exports = mongoose.model("Tokens", TokenSchema));