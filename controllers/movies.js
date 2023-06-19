const movieSchema = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

const {
  NOT_FOUND_MOVIE,
  WRONG_MOVIE,
  ACCESS_ERROR,
  DELETE_WRONG_MOVIE,
} = require('../utils/constants');

// Возвращаем сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

// Создаем фильм
module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;

  movieSchema
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
      owner: req.user._id,
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(
          new BadRequestError(WRONG_MOVIE), // Переданы некорректные данные при создании фильма.
        );
      } else {
        next(err);
      }
    });
};

// Удаляем фильм
module.exports.deleteMovie = (req, res, next) => {
  movieSchema.findById(req.params.movieId)
    .orFail(() => {
      throw new NotFoundError(NOT_FOUND_MOVIE); // Фильм с указанным _id не найден.
    })
    .then((movie) => {
      const owner = movie.owner.toString();
      if (req.user._id === owner) {
        movieSchema.deleteOne(movie)
          .then(() => {
            res.send(movie);
          })
          .catch(next);
      } else {
        // eslint-disable-next-line max-len
        throw new ForbiddenError(ACCESS_ERROR); // Отказано в доступе! Данный фильм не принадлежит пользователю!
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(DELETE_WRONG_MOVIE)); // Переданы некорректные данные при удалении!
      } else {
        next(err);
      }
    });
};
