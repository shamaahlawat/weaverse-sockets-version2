
import bcrypt from 'bcrypt-nodejs';
import mongoose from '../db';
import { PASS_HASH_ROUNDS } from '../config';


const UserSchema = new mongoose.Schema(
  {
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
    status: { type: String, default: "Busy" },
  }
);


UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject()
  delete userObject.password
  return userObject
}

UserSchema.statics.findByCredentials = function (email, password) {
  let User = this;
  return User.findOne({ email }).then(user => {
    if (!user) {
      return Promise.reject({
        code: 404,
        msg: 'Invalid email, user not found'
      });
    }
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user._doc);
        } else {
          reject({ code: 401, msg: 'Incorrect Password' });
        }
      });
    });
  });
};

UserSchema.pre('save', function (next) {
  const user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(PASS_HASH_ROUNDS, (err, salt) => {
      if (err) {
        throw err;
      }
      bcrypt.hash(user.password, salt, null, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});



var User = module.exports = mongoose.model('Users', UserSchema);







