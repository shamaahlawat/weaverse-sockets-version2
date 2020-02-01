"use strict";

var _db = require("../db");

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const WorkspaceSchema = new _db2.default.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ["0", "1", "2", "3"], // 0 = pending , 1 = active 2 = inactive 3 = delete
    default: "0",
    trim: true
  },
  member: [{
    userId: {
      type: _db2.default.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    }
  }], //Array of Emails of Members

  createdBy: {
    type: _db2.default.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  } //We store Email of Admins
}, { timestamps: true });

module.exports = _db2.default.model('Workspaces', WorkspaceSchema);
module.exports.createWorkspace = function (newWorkspace, callback) {
  newWorkspace.save(callback);
};
//# sourceMappingURL=Workspace.model.js.map