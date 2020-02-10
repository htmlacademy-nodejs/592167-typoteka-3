'use strict';

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const HttpCode = {
  OK: 200,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  FORBIDDEN: 403,
  UNAUTHORIZED: 401,
};

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;
const FILE_NAME = `mock.json`;

module.exports = {
  ExitCode,
  HttpCode,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
  FILE_NAME,
};
