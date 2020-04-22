'use strict';

const chalk = require(`chalk`);
const packageJsonFile = require(`../../package`);

module.exports = {
  name: `--version`,
  run() {
    console.info(chalk.blue(packageJsonFile.version));
  }
};
