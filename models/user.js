const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const NotAuthError = require('../errors/NotAuthError');

// eslint-disable-next-line function-paren-newline
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный email',
    },
    required: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
},
// eslint-disable-next-line function-paren-newline
{ versionKey: false });

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new NotAuthError('Неправильная почта или пароль'));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new NotAuthError('Неправильная почта или пароль'));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
