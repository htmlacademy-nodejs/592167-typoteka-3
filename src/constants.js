'use strict';

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const DEFAULT = {
  COMMAND: `--help`,
  PREVIEWS_COUNT: 8,
  OFFSET: 0,
  ORDER: `DESC`,
  LIMIT: 8,
};

const HttpCode = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  GONE: 410,
  INTERNAL_SERVER_ERROR: 500,
};

const USER_ARGV_INDEX = 2;
const COMMENTS_COUNT_FOR_MAIN_PAGE = 4;
const MOCK_FILE_NAME = `mock.json`;
const MOCK_USER_ID = 1;
const BACKEND_URL = `http://localhost:8081`;
const FRONTEND_URL = `http://localhost:8080`;

const TEMPLATE = {
  REGISTRATION: `registration`,
  NEW_POST: `new-post`,
  SIGN_IN: `sign-in`,
};

const REGISTRATION_MESSAGE = {
  EMAIL_REQUIRED_FIELD: `Поле "Электронная почта" обязательно для заполнения`,
  EMAIL_WRONG: `Неправильный email`,
  EMAIL_MAX_LENGTH: `Поле "Электронная почта" не может быть более 255 символов`,
  PASSWORDS_NOT_EQUALS: `Пароль и подтверждение пароля не совпадает`,
  PASSWORD_MAX_LENGTH: `Поле "Пароль" не может быть более 255 символов`,
  PASSWORD_MIN_LENGTH: `Поле "Пароль" не может быть менее 6 символов`,
  PASSWORD_REQUIRED_FIELD: `Поле "Пароль" обязательно для заполнения`,
  REPEAT_MAX_LENGTH: `Поле "Повтор пароля" не может быть более 255 символов`,
  REPEAT_MIN_LENGTH: `Поле "Повтор пароля" не может быть менее 6 символов`,
  REPEAT_REQUIRED_FIELD: `Поле "Повтор пароля" обязательно для заполнения`,
  USER_ALREADY_REGISTER: `Пользователь с таким Email уже зарегистрирован`,
  USER_NAME_MAX_LENGTH: `Поле "Имя" не может быть более 50 символов`,
  USER_NAME_PATTERN: `Поле "Имя" не должно содержать цифр и специальных символов`,
  USER_NAME_REQUIRED_FIELD: `Поле "Имя" обязательно для заполнения`,
  USER_SURNAME_MAX_LENGTH: `Поле "Фамилия" не может быть более 50 символов`,
  USER_SURNAME_PATTERN: `Поле "Фамилия" не должно содержать цифр и специальных символов`,
  USER_SURNAME_REQUIRED_FIELD: `Поле "Фамилия" обязательно для заполнения`,
};

const LOGIN_MESSAGE = {
  BAD_LOGIN: `Пользователь с таким Email не зарегистрирован или пароль указан неверно`,
};


module.exports = {
  ExitCode,
  HttpCode,
  USER_ARGV_INDEX,
  MOCK_FILE_NAME,
  BACKEND_URL,
  FRONTEND_URL,
  DEFAULT,
  COMMENTS_COUNT_FOR_MAIN_PAGE,
  MOCK_USER_ID,
  TEMPLATE,
  REGISTRATION_MESSAGE,
  LOGIN_MESSAGE,
};
