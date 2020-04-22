'use strict';

const help = require(`src/cli/help`);
const version = require(`src/cli/version`);
const generate = require(`src/cli/generate`);
const server = require(`src/cli/server`);

const Cli = {
  [help.name]: help,
  [version.name]: version,
  [generate.name]: generate,
  [server.name]: server,
};

module.exports = {
  Cli,
};
