'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const chalk = require(`chalk`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mock.json`;

const startServer = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;
  http.createServer(onClientConnect)
    .listen(port)
    .on(`listening`, (err) => {
      if (err) {
        return console.error(chalk.red(`Ошибка при создании сервера`, err));
      }

      return console.info(chalk.green(`Ожидаю соединений по порту ${port}`));
    });
};

module.exports = {
  name: `--server`,
  async run(args) {
    startServer(args);
  }
};
