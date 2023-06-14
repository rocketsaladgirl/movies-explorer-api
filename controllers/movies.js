const movieSchema = require('../models/movie');

const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');

// Возвращаем сохранённые текущим пользователем фильмы
module.exports.getMovies = (req, res, next) => {
  movieSchema.find({ owner: req.user._id })
    .then((movies) => res.send(movies.reverse()))
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
  const owner = req.user._id;

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
      owner,
    })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

// Удаляем фильм
module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  const userId = req.user._id;

  movieSchema
    .findById(movieId)
    .orFail(new NotFoundError('Фильм с указанным _id не найден.'))
    .then((movie) => {
      if (movie.owner.toString() !== userId) {
        return next(new ForbiddenError('Отказано в доступе! Данный фильм не принадлежит пользователю!'));
      }
      return movieSchema.deleteOne(movie)
        .then(() => res.status(200)
          .send({ message: 'Фильм успешно удалён!' }));
    })
    .catch(next);
};
