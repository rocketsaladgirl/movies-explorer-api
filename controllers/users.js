const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ConflictError = require('../errors/ConflictError'); // 403
const NotAuthError = require('../errors/NotAuthError'); // 401

const {
  EMAIL_ALREADY_EXISTS,
  WRONG_EMAIL_OR_PASSWORD,
  WRONG_CREATE_USER,
  USER_ID_NOT_FOUND,
  USER_NOT_FOUND,
  USER_ALREADY_EXISTS,
  GOODBYE_MESSAGE,
} = require('../utils/constants');

const { jwtKey } = require('../utils/option');

// Получение данных о пользователе
const getUser = (id, res, next) => {
  userSchema
    .findById(id)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line max-len
        return next(new NotFoundError(USER_ID_NOT_FOUND)); // 'Пользователь с указанным _id не найден.
      }
      return next(err);
    });
};

module.exports.getCurrentUser = (req, res, next) => getUser(req.user._id, res, next);

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema.create({
        email,
        password: hash,
        name,
      })
        .then((user) => {
          const noValidUser = user.toObject({ useProjection: true });
          return res.status(201).send(noValidUser);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            // eslint-disable-next-line max-len
            return next(new BadRequestError(WRONG_CREATE_USER)); // Пользователь с таким email уже существует.
          }
          if (err.code === 11000) {
            // eslint-disable-next-line max-len
            return next(new ConflictError(EMAIL_ALREADY_EXISTS)); // Переданы некорректные данные при создании пользователя.
          }
          return next(err);
        });
    });
};

// Модификация пользователя
const updateUserData = (id, data, res, next) => {
  userSchema
    .findByIdAndUpdate(
      id,
      data,
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError(USER_ALREADY_EXISTS)); // Такой пользователь уже существует.
      }
      if (err.name === 'DocumentNotFoundError') {
        // eslint-disable-next-line max-len
        return next(new NotFoundError(USER_NOT_FOUND)); // Пользователь не найден.
      }
      return next(err);
    });
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;

  return updateUserData(req.user._id, { name, email }, res, next);
};

// Логин пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  userSchema.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new NotAuthError(WRONG_EMAIL_OR_PASSWORD));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return next(new NotAuthError(WRONG_EMAIL_OR_PASSWORD));
          }

          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwtKey, { expiresIn: '7d' });
          // Добавлена авторизация через куки
          res.cookie('jwt', token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            saneSite: true,
          });

          return res.send(user.toJSON({ useProjection: true }));
        });
    })
    .catch(next);
};

// Деавторизация пользователя
module.exports.logout = (req, res) => {
  res.clearCookie('jwt').send({ message: GOODBYE_MESSAGE });
};
