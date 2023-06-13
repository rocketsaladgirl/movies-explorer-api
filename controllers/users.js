const { NODE_ENV, JWT_SECRET } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = require('../models/user');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictError = require('../errors/ConflictError');

// module.exports.getUsers = (req, res, next) => {
//   userSchema
//     .find({})
//     .then((users) => res.status(200)
//       .send(users))
//     .catch(next);
// };

// const findUser = (id, res, next) => {
//   userSchema
//     .findById(id)
//     .orFail()
//     .then((user) => res.status(200).send(user))
//     .catch((err) => {
//       if (err.name === 'DocumentNotFoundError') {
//         return next(new NotFoundError('Пользователь по данному _id не найден'));
//       }
//       return next(err);
//     });
// };

// module.exports.getUser = (req, res, next) => findUser(req.user._id, res, next);

// module.exports.getUserById = (req, res, next) => findUser(req.params.userId, res, next);

// module.exports.getUserById = (req, res, next) => {
//   const { userId } = req.params;

//   userSchema
//     .findById(userId)
//     .then((user) => {
//       if (!user) {
//         throw new NotFoundError('Пользователь по указанному _id не найден');
//       }
//       res.send(user);
//     })
//     .catch((err) => {
//       if (err.name === 'CastError') {
//       return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
//       }
//       return next(err);
//     });
// };

// Получаем информацию о текущем пользователе
module.exports.getUser = (req, res, next) => {
  userSchema
    .findById(req.user._id)
    .orFail(() => next(new NotFoundError('Пользователь не найден')))
    .then((user) => res.send(user))
    .catch(next);
};

// Создаем пользователя
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
            return next(new ConflictError('Пользователь с таким email уже существует'));
          }
          if (err.name === 'ValidationError') {
            return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
          }
          return next(err);
        });
    })
    .catch(next);
};

// Обновляем данные пользователя
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
      throw new NotFoundError('Пользователь с указанным _id не найден');
    })
    .then((user) => res.status(200)
      .send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении профиля'));
      }
      return next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return userSchema
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'JWT-token', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
