'use strict';

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const ChannelSchema = new _db2.default.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  workspaceId: {
    type: _db2.default.Schema.Types.ObjectId,
    ref: 'Workspaces',
    required: true
  },
  type: {
    type: String,
    enum: ['global', "private"],
    default: 'global',
    required: true,
    trim: true
  },
  member: [{
    userId: {
      type: _db2.default.Schema.Types.ObjectId,
      ref: "Users"
      // required: true,
    }
  }], //Array of Emails of Members
  status: {
    type: String,
    enum: ["0", "1", "2"], // 0 = inactive , 1 = active 2 = delete
    default: "1",
    trim: true
  },

  createdBy: {
    type: _db2.default.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  } //We store Email of Admins
}, { timestamps: true });

var Channel = module.exports = _db2.default.model('Channel', ChannelSchema);
module.exports.createChannel = function (newChannel, callback) {
  newChannel.save(callback);
};
//# sourceMappingURL=Channel.model.js.map