const mongoose = require('mongoose');
const moment = require('moment');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, lowercase: true },
  password: { type: String, min: 6 , required:true},
  profile: {
    name: { type: String, default: '',required:true },
    picture: { type: String, default: '' },
  },
  address: { type: String, default: '(Please Update Address)' },
  timestamp: {
    type: String,
    default: () => moment().format('MMMM Do YYYY, h:mm:ss a'),
  },
});

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('user', UserSchema);
