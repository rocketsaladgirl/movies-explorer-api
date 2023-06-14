const movieRoutes = require('express')
  .Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validations');
const auth = require('../middlewares/auth');

movieRoutes.use(auth);

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validateCreateMovie, createMovie);
movieRoutes.delete('/:movieId', validateDeleteMovie, deleteMovie);

module.exports = movieRoutes;
