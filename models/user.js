const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');

const { WRONG_EMAIL } = require('../utils/constants');

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

module.exports = mongoose.model('user', userSchema);
