const mongoose = require('mongoose');
const isURL = require('validator/lib/isURL'); // const validator = require('validator');

const { WRONG_URL } = require('../utils/constants');

// eslint-disable-next-line function-paren-newline
const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https', 'ftp'] }),
      message: WRONG_URL, // Некорректная ссылка
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https', 'ftp'] }),
      message: WRONG_URL, // Некорректная ссылка
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (v) => isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https', 'ftp'] }),
      message: WRONG_URL, // Некорректная ссылка
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
},
// eslint-disable-next-line function-paren-newline
{ versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
