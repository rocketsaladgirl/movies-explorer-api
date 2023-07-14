const userRoutes = require('express').Router();

const { getCurrentUser, updateUser } = require('../controllers/users');
const { validationUpdateUser } = require('../middlewares/validations');

userRoutes.get('/me', getCurrentUser);
userRoutes.patch('/me', validationUpdateUser, updateUser);

module.exports = userRoutes;
