"use strict";

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ChatSchema = new _db2.default.Schema({
    roomId: {
        type: _db2.default.Schema.Types.ObjectId,
        required: true,
        trim: true
    },
    workspaceId: {
        type: _db2.default.Schema.Types.ObjectId,
        ref: "Workspaces",
        required: true
    },
    senderId: {
        type: _db2.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    message: {
        type: String,
        trim: true
    },
    image: {
        type: String
    },
    messageType: {
        type: String,
        enum: ['text', 'file'],
        default: 'text'
    },
    seenUserId: [{
        userId: {
            type: _db2.default.Schema.Types.ObjectId,
            ref: 'Users'
        }
    }]

}, { timestamps: true });

var ChannelChat = module.exports = _db2.default.model('ChannelChats', ChatSchema);
//# sourceMappingURL=ChannelChat.model.js.map