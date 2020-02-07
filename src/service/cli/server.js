'use strict';

const fs = require(`fs`).promises;
const http = require(`http`);
const chalk = require(`chalk`);

const {HttpCode} = require(`../../constants`);

const DEFAULT_PORT = 3000;
const FILE_NAME = `mock.json`;

const sendResponse = (res, statusCode, message) => {
  const template = `
  <!Doctype html>
    <html lang="ru">
        <head>
            <title>Typoteka</title>
        </head>
        <body>
            ${message}
        </body>
    </html>
  `.trim();

  res.statusCode = statusCode;
  res.writeHead(statusCode, {
    'Content-Type': `text/html; charset=UTF-8`,
  });
  res.end(template);
};

const onClientConnect = async (req, res) => {
  const notFoundMessageText = `Not found`;

  switch (req.url) {
    case `/`:
      try {
        const content = await fs.readFile(FILE_NAME);
        const mocks = JSON.parse(content);
        const message = mocks.map((elem) => `<li>${elem.title}</li>`).join(``);
        sendResponse(res, HttpCode.OK, `<ul>${message}</ul>`);
      } catch (err) {
        sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
      }
      break;

    default:
      sendResponse(res, HttpCode.NOT_FOUND, notFoundMessageText);
  }
};

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
