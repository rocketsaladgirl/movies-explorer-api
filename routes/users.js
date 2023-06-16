const userRoutes = require('express')
  .Router();

const { getUser, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');

userRoutes.get('/me', getUser);
userRoutes.patch('/me', validationUpdateUser, updateUser);

module.exports = userRoutes;
