'use strict';

const {getLogger} = require(`../backend/logger`);
const logger = getLogger();

const app = require(`../backend/app`);
const DEFAULT_PORT = 3000;

const startServer = async (args) => {
  const [customPort] = args;
  const port = Number.parseInt(customPort, 10) || DEFAULT_PORT;

  app.listen(port, () => {
    logger.info(`Server start on: ${port}`);
  }).on(`error`, (err) => {
    logger.error(`Server can't start. Error: ${err}`);
  });
};

module.exports = {
  name: `--server`,
  async run(args) {
    startServer(args);
  }
};
