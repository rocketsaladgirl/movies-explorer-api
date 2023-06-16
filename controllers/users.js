const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

const {
  EMAIL_ALREADY_EXISTS,
  WRONG_PROFILE,
  WRONG_USER,
  USER_ID_NOT_FOUND,
  USER_NOT_FOUND,
  WRONG_DATA,
} = require('../utils/constants');

const { jwtKey } = require('../utils/option');

module.exports.getUser = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(USER_NOT_FOUND);
      }
      res.status(200)
        .send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(BadRequestError(WRONG_DATA));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      userSchema
        .create({
          name,
          email,
          password: hash,
        })
        .then(() => res.status(201)
          .send(
            {
              data: {
                name,
                email,
              },
            },
          ))
        .catch((err) => {
          if (err.code === 11000) {
            return next(new ConflictError(EMAIL_ALREADY_EXISTS));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError(WRONG_USER));
          }
          return next(err);
        });
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const {
    name,
    email,
  } = req.body;

  userSchema
    .findByIdAndUpdate(
      req.user._id,
      {
        name,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    )
    .orFail(() => {
      throw new NotFoundError(USER_ID_NOT_FOUND);
    })
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(WRONG_PROFILE));
      }
      return next(err);
    });
};

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
