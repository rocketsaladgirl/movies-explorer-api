const AUTH_REQUIRED = 'Необходима авторизация!';
const SERVER_ERROR = 'На сервере произошла ошибка.';
const WRONG_EMAIL_OR_PASSWORD = 'Неправильная почта или пароль.';
const WRONG_EMAIL = 'Неправильный формат почты.';
const WRONG_URL = 'Некорректная ссылка.';
const URL_NOT_FOUND = '404: Ошибка! Данные не найдены!';
const WRONG_DATA = 'Переданы некорректные данные.';
const GOODBYE_MESSAGE = 'До свидания!';

// Блок пользователя
const EMAIL_ALREADY_EXISTS = 'Пользователь с таким email уже существует.';
const WRONG_CREATE_USER = 'Переданы некорректные данные при создании пользователя.';
const USER_ID_NOT_FOUND = 'Пользователь с указанным _id не найден.';
const USER_NOT_FOUND = 'Пользователь не найден.';
const USER_ALREADY_EXISTS = 'Такой пользователь уже существует.';

// Блок с фильмами
const ACCESS_ERROR = 'Отказано в доступе! Данный фильм не принадлежит пользователю!';
const NOT_FOUND_MOVIE = 'Фильм с указанным _id не найден.';
const DELETE_WRONG_MOVIE = 'Переданы некорректные данные при удалении!';

// Корс политика
const allowedCors = [
  'https://rocketsaladgirl.nomoredomains.rocks',
  'http://rocketsaladgirl.nomoredomains.rocks',
  'localhost:3000',
  'http://localhost',
  'http://localhost:3001',
  'http://localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  optionsSuccessStatus: 200,
  credentials: true,
};

module.exports = {
  EMAIL_ALREADY_EXISTS,
  WRONG_CREATE_USER,
  USER_NOT_FOUND,
  USER_ID_NOT_FOUND,
  USER_ALREADY_EXISTS,
  AUTH_REQUIRED,
  SERVER_ERROR,
  WRONG_EMAIL_OR_PASSWORD,
  WRONG_EMAIL,
  WRONG_URL,
  URL_NOT_FOUND,
  WRONG_DATA,
  DELETE_WRONG_MOVIE,
  ACCESS_ERROR,
  NOT_FOUND_MOVIE,
  GOODBYE_MESSAGE,
  allowedCors,
  corsOptions,
};
