'use strict';

var _db = require('../db');

var _db2 = _interopRequireDefault(_db);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const UserSchema = new _db2.default.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  phone: { type: String, required: true, minlength: 10, maxlength: 10, trim: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, minlength: 1, trim: true },
  lastName: { type: String, required: true, minlength: 1, trim: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  isActivated: Boolean,
  skype: { type: String, trim: true },
  bio: { type: String },
  picture: { type: String, trim: true },
  socialLinks: {
    facebook: { type: String, default: null },
    twitter: { type: String, default: null },
    linkedin: { type: String, default: null }
  },
  designation: { type: String, default: null },
  experience: { type: String, default: null },
  status: { type: String, default: "Busy" }
});

var User = module.exports = _db2.default.model('Users', UserSchema);
//# sourceMappingURL=User.model.js.map