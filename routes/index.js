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

router.use('/', userRoutes);
router.use('/', movieRoutes);

router.use('*', (req, res, next) => {
  next(new NotFoundError(URL_NOT_FOUND)); // 404: Ошибка! Данные не найдены!
});

module.exports = router;
