const movieRoutes = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movies');
const { validateCreateMovie, validateDeleteMovie } = require('../middlewares/validations');

movieRoutes.get('/', getMovies);
movieRoutes.post('/', validateCreateMovie, createMovie);
movieRoutes.delete('/:_id', validateDeleteMovie, deleteMovie);

module.exports = movieRoutes;
