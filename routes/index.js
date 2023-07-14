const router = require('express').Router();
const { errors } = require('celebrate');

const userRoutes = require('./users');
const movieRoutes = require('./movies');

const { createUser, login, logout } = require('../controllers/users');

const auth = require('../middlewares/auth');

const { validationCreateUser, validationLogin } = require('../middlewares/validations');

const NotFoundError = require('../errors/NotFoundError');

const { URL_NOT_FOUND } = require('../utils/constants');

const { errorLogger } = require('../middlewares/logger');

router.post('/signup', validationCreateUser, createUser);
router.post('/signin', validationLogin, login);
router.get('/signout', logout);

router.use(auth);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use('/*', (req, res, next) => {
  next(new NotFoundError(URL_NOT_FOUND)); // 404: Ошибка! Данные не найдены!
});
router.use(errorLogger);
router.use(errors({ message: 'Ошибка валидации данных!' }));

module.exports = router;
