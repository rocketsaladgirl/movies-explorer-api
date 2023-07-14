const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError'); // 401

const { jwtKey } = require('../utils/option');
const { AUTH_REQUIRED } = require('../utils/constants'); // Необходима авторизация!

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtKey);
  } catch (err) {
    return next(new NotAuthError(AUTH_REQUIRED)); // Необходима авторизация!
  }

  req.user = payload;

  return next();
};
