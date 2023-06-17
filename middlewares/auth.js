const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { jwtKey } = require('../utils/option');
const { AUTH_REQUIRED } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer')) {
    throw new NotAuthError(AUTH_REQUIRED); // Необходима авторизация!
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : jwtKey);
  } catch (err) {
    next(new NotAuthError(AUTH_REQUIRED)); // Необходима авторизация!
    return;
  }

  req.user = payload;

  next();
};
