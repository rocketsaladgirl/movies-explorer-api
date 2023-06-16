const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 100,
});

const baseUrl = 'mongodb://127.0.0.1:27017/bitfilmsdb';

const jwtKey = 'JWT-token';

module.exports = {
  limiter,
  baseUrl,
  jwtKey,
};
