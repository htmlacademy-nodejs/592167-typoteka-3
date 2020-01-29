'use strict';

const ExitCode = {
  success: 0,
  error: 1,
};

const DEFAULT_COMMAND = `--help`;
const USER_ARGV_INDEX = 2;

module.exports = {
  ExitCode,
  DEFAULT_COMMAND,
  USER_ARGV_INDEX,
};
