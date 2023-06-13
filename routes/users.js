const userRoutes = require('express')
  .Router();
const { getUser, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');
const auth = require('../middlewares/auth');

userRoutes.use(auth);
userRoutes.get('/me', getUser);
userRoutes.patch('/me', validationUpdateUser, updateUser);

module.exports = userRoutes;
