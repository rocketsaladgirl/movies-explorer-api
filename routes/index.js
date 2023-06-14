const router = require('express').Router();

const userRoutes = require('./users');
const movieRoutes = require('./movies');

const { createUser, login } = require('../controllers/users');

const auth = require('../middlewares/auth');

const { validationCreateUser, validationLogin } = require('../middlewares/validations');

const NotFoundError = require('../errors/NotFoundError');

router.post('/singup', validationCreateUser, createUser);
router.post('/singin', validationLogin, login);

router.use('/users', userRoutes);
router.use('/movies', movieRoutes);

router.use(auth);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('404: Ошибка! Данные не найдены!'));
});

module.exports = router;
