'use strict';

const fs = require(`fs`).promises;
const express = require(`express`);
const chalk = require(`chalk`);

const {HttpCode, MOCK_FILE_NAME} = require(`../../constants`);
const {initializeRoutes} = require(`../routes/index`);

const DEFAULT_PORT = 3000;
const app = express();

const startServer = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  initializeRoutes(app);
  app.listen(port, () => {
    console.log(`Сервер запущен на порту: ${port}`);
  })
};

module.exports = {
  name: `--server`,
  async run(args) {
    startServer(args);
  }
};
