const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const isEmail = require('validator/lib/isEmail');

const NotAuthError = require('../errors/NotAuthError');
const { WRONG_EMAIL_OR_PASSWORD, WRONG_EMAIL } = require('../utils/constants');

// eslint-disable-next-line function-paren-newline
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => isEmail(v),
      message: WRONG_EMAIL, // Неправильный формат почты
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
},
// eslint-disable-next-line function-paren-newline
{ versionKey: false });

userSchema.statics.findUserByCredentials = function findOne(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // eslint-disable-next-line max-len
        return Promise.reject(new NotAuthError(WRONG_EMAIL_OR_PASSWORD)); // Неправильная почта или пароль
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // eslint-disable-next-line max-len
            return Promise.reject(new NotAuthError(WRONG_EMAIL_OR_PASSWORD)); // Неправильная почта или пароль
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
