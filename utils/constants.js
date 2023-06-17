const AUTH_REQUIRED = 'Необходима авторизация!';
const SERVER_ERROR = 'На сервере произошла ошибка.';
const WRONG_EMAIL_OR_PASSWORD = 'Неправильная почта или пароль.';
const WRONG_EMAIL = 'Некорректный email.';
const WRONG_URL = 'Некорректная ссылка.';
const URL_NOT_FOUND = '404: Ошибка! Данные не найдены!';
const WRONG_DATA = 'Переданы некорректные данные.';

// Блок пользователя
const EMAIL_ALREADY_EXISTS = 'Пользователь с таким email уже существует.';
const WRONG_CREATE_USER = 'Переданы некорректные данные при создании пользователя.';
const WRONG_PROFILE = 'Переданы некорректные данные при обновлении профиля.';
const USER_ID_NOT_FOUND = 'Пользователь с указанным _id не найден.';
const USER_NOT_FOUND = 'Пользователь не найден.';
const USER_ALREADY_EXISTS = 'Такой пользователь уже существует.';

// Блок с фильмами
const ACCESS_ERROR = 'Отказано в доступе! Данный фильм не принадлежит пользователю!';
const NOT_FOUND_MOVIE = 'Фильм с указанным _id не найден.';
const WRONG_MOVIE = 'Переданы некорректные данные при создании фильма.';
const DELETE_WRONG_MOVIE = 'Переданы некорректные данные при удалении!';

module.exports = {
  EMAIL_ALREADY_EXISTS,
  WRONG_CREATE_USER,
  WRONG_PROFILE,
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
  WRONG_MOVIE,
};
