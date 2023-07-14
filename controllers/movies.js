const movieSchema = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError'); // 400
const NotFoundError = require('../errors/NotFoundError'); // 404
const ForbiddenError = require('../errors/ForbiddenError'); // 403

const {
  NOT_FOUND_MOVIE,
  ACCESS_ERROR,
  DELETE_WRONG_MOVIE,
} = require('../utils/constants');

// Возвращаем сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  const currentUserId = req.user._id;

  movieSchema.find({ owner: currentUserId })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch(next);
};

// Создаем фильм
module.exports.createMovie = (req, res, next) => {
  const currentUserId = req.user._id;

  movieSchema.create({ ...req.body, owner: currentUserId })
    .then((movie) => res.status(201).send(movie))

    .catch(next);
};

// Удаляем фильм
module.exports.deleteMovie = (req, res, next) => {
  const currentUserId = req.user._id;

  movieSchema.findById(req.params._id)
    .orFail()
    .then((movie) => {
      const ownerId = movie.owner.toString();
      if (ownerId !== currentUserId) {
        // eslint-disable-next-line max-len
        throw new ForbiddenError(ACCESS_ERROR); // Отказано в доступе! Данный фильм не принадлежит пользователю!
      }
      return movie;
    })
    .then((movie) => movie.deleteOne())
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return next(new NotFoundError(NOT_FOUND_MOVIE)); // Фильм с указанным _id не найден.
      }
      if (err.name === 'CastError') {
        // eslint-disable-next-line max-len
        return next(new BadRequestError(DELETE_WRONG_MOVIE)); // Переданы некорректные данные при удалении!
      }
      return next(err);
    });
};
