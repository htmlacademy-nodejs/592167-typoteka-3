'use strict';

const chalk = require(`chalk`);

const helpText = () => {
  console.log(chalk.gray(`Описание программы:
    1. Запускает http-сервер на указанном порту,
    2. Формирует файл с моковыми данными для API,
    3. Делает первичную инициализацию базы данных,
    4. Заполняет базу данных моковыми данными.


    Поддерживаемые команды:
    npm start -- --version:            выводит номер версии
    npm start -- --help:               печатает этот текст
    npm start -- --generate <count>    формирует файл mock.json
    npm start -- --server <count>      запускает http-сервер на указанном порту

    npm run server                     запускает фронтовую и бекэндовую часть приложения
    `));
};

module.exports = {
  name: `--help`,
  run() {
    helpText();
  }
};
