import mongoose from '../db';
const WorkspaceSchema = new mongoose.Schema({
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
    enum: ["0", "1", "2", "3"],   // 0 = pending , 1 = active 2 = inactive 3 = delete
    default: "0",
    trim: true
  },
  member: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
  }], //Array of Emails of Members

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  }, //We store Email of Admins
}, { timestamps: true });







module.exports = mongoose.model('Workspaces', WorkspaceSchema);
module.exports.createWorkspace = function (newWorkspace, callback) {
  newWorkspace.save(callback);
}



