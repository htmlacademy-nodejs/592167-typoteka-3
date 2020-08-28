'use strict';

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const DEFAULT = {
  COMMAND: `--help`,
  PREVIEWS_COUNT: 8,
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
const MOCK_FILE_NAME = `mock.json`;
const BACKEND_URL = `http://localhost:8081`;


module.exports = {
  ExitCode,
  HttpCode,
  USER_ARGV_INDEX,
  MOCK_FILE_NAME,
  BACKEND_URL,
  DEFAULT,
};
