const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');

const NotAuthError = require('../errors/NotAuthError');

const { AUTH_REQUIRED } = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return next(new NotAuthError(AUTH_REQUIRED));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'JWT-token');
  } catch (err) {
    return next(new NotAuthError(AUTH_REQUIRED));
  }
  req.user = payload;
  return next();
};
