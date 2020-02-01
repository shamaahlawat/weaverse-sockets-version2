"use strict";

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const RoomSchema = new _db2.default.Schema({
    senderId: {
        type: _db2.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    receiverId: {
        type: _db2.default.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    workspaceId: {
        type: _db2.default.Schema.Types.ObjectId,
        ref: "Workspaces",
        required: true
    }
}, { timestamps: true });

var Room = module.exports = _db2.default.model('Rooms', RoomSchema);
//# sourceMappingURL=Room.model.js.map