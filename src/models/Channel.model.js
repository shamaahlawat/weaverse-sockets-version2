import mongoose from '../db';

const ChannelSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  workspaceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspaces',
    required: true,
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      // required: true,
    }
  }], //Array of Emails of Members
  status: {
    type: String,
    enum: ["0", "1", "2"],   // 0 = inactive , 1 = active 2 = delete
    default: "1",
    trim: true
  },


  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  }, //We store Email of Admins
}, { timestamps: true });



var Channel = module.exports = mongoose.model('Channel', ChannelSchema);
module.exports.createChannel = function (newChannel, callback) {
  newChannel.save(callback);
}