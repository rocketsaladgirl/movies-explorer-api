const isURL = require('validator/lib/isURL');
const { celebrate, Joi } = require('celebrate');

const BadRequestError = require('../errors/BadRequestError');

const validationUrl = (url) => {
  const validate = isURL(url);
  if (validate) {
    return url;
  }
  throw new BadRequestError('Некорректный URL адрес');
};

// const validationId = (id) => {
//   const regex = /^[0-9a-fA-F]{24}$/;
//   if (regex.test(id)) return id;
//   throw new BadRequestError('Некорректный id');
// };

// Регистрация пользователя
module.exports.validationCreateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
});

// Логин пользователя
module.exports.validationLogin = celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
});

// module.exports.validationUserId = celebrate({
//   params: Joi.object()
//     .keys({
//       userId: Joi.string().required().custom(validationId),
//     }),
// });

// Изменение данных пользователя
module.exports.validationUpdateUser = celebrate({
  body: Joi.object()
    .keys({
      name: Joi.string().min(2).max(30).required(),
      about: Joi.string().min(2).max(30).required(),
    }),
});

// Создание фильма
module.exports.validateCreateMovie = celebrate({
  body: Joi.object()
    .keys({
      country: Joi.string().required(),
      director: Joi.string().required(),
      duration: Joi.number().required(),
      year: Joi.string().required(),
      description: Joi.string().required(),
      image: Joi.string().required().custom(validationUrl),
      trailerLink: Joi.string().required().custom(validationUrl),
      thumbnail: Joi.string().required().custom(validationUrl),
      movieId: Joi.number().required(),
      nameRU: Joi.string().required(),
      nameEN: Joi.string().required(),
    }),
});

module.exports.validateDeleteMovie = celebrate({
  params: Joi.object()
    .keys({
      movieId: Joi.string().required().length(24).hex(),
    }),
});
