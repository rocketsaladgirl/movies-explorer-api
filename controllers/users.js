const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const {
  EMAIL_ALREADY_EXISTS,
  WRONG_UPDATE_PROFILE,
  WRONG_CREATE_USER,
  USER_ID_NOT_FOUND,
  USER_NOT_FOUND,
  USER_ALREADY_EXISTS,
} = require('../utils/constants');

const { jwtKey } = require('../utils/option');

// Получение данных о пользователе
module.exports.getUser = (req, res, next) => {
  const userId = req.user._id;
  userSchema
    .findById(userId)
    .orFail(() => {
      throw new NotFoundError(USER_ID_NOT_FOUND); // Пользователь с указанным _id не найден.
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(USER_NOT_FOUND)); // Пользователь не найден.
      } else {
        next(err);
      }
    });
};

// Создание пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => userSchema.create({
      email,
      password: hash,
      name,
    }))
    .then((user) => res.status(201).send({
      email: user.email,
      name: user.name,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(EMAIL_ALREADY_EXISTS)); // Пользователь с таким email уже существует.
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line max-len
        next(new BadRequestError(WRONG_CREATE_USER)); // Переданы некорректные данные при создании пользователя.
      } else {
        next(err);
      }
    });
};

// Модификация пользователя
module.exports.updateUser = (req, res, next) => {
  const {
    email,
    name,
  } = req.body;

  userSchema
    .findByIdAndUpdate(
      req.user._id,
      { email, name },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => {
      throw new NotFoundError(USER_ID_NOT_FOUND); // Пользователь с указанным _id не найден.
    })
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(USER_ALREADY_EXISTS)); // Такой пользователь уже существует.
      } else if (err.name === 'ValidationError') {
        // eslint-disable-next-line max-len
        next(new BadRequestError(WRONG_UPDATE_PROFILE)); // Переданы некорректные данные при обновлении профиля.
      } else {
        next(err);
      }
    });
};

// Логин пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : jwtKey, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
