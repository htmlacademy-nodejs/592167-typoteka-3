'use strict';

const chalk = require(`chalk`);

const helpText = () => {
  console.log(chalk.gray(`Программа формирует файл с данными для API.
    
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mock.json`));
};

module.exports = {
  name: `--help`,
  run() {
    helpText();
  }
};
