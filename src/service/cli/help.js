'use strict';

const chalk = require(`chalk`);

const helpText = () => {
  console.log(chalk.gray(`Программа запускает http-сервер и формирует файл с данными для API.
    
    Команды:
    --version:            выводит номер версии
    --help:               печатает этот текст
    --generate <count>    формирует файл mock.json
    --server <count>      запускает http-сервер на указанном порту
    `));
};

module.exports = {
  name: `--help`,
  run() {
    helpText();
  }
};
