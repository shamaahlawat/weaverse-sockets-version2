"use strict";

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const TokenSchema = new _db2.default.Schema({

    userId: {
        type: _db2.default.Schema.Types.ObjectId,
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
    }
}, { timestamps: true });

var Token = module.exports = _db2.default.model("Tokens", TokenSchema);
//# sourceMappingURL=token.model.js.map