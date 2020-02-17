'use strict';

const chalk = require(`chalk`);

const helpText = () => {
  console.log(chalk.gray(`Описание программы:
    1. Запускает http-сервер на указанном порту,
    2. Формирует файл с данными для API.
    
    Поддерживаемые команды:
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
