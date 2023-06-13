const mongoose = require('mongoose');
const validator = require('validator');

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
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Некорректная ссылка',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Некорректная ссылка',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => validator.isUrl(v),
      message: 'Некорректная ссылка',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    require: true,
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
