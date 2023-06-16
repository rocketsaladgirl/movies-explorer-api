const router = require('express').Router();

const userRoutes = require('./users');
const movieRoutes = require('./movies');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');

const { validationCreateUser, validationLogin } = require('../middlewares/validations');

const NotFoundError = require('../errors/NotFoundError');

const { URL_NOT_FOUND } = require('../utils/constants');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('/*', (req, res, next) => {
  next(new NotFoundError(URL_NOT_FOUND));
});

module.exports = router;
