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
};
