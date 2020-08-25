'use strict';

const {getLogger} = require(`../backend/logger`);
const logger = getLogger();
require(`dotenv`).config();

const app = require(`../backend/app`);
const {connectDb} = require(`../backend/db/db-connect`);
const DEFAULT_PORT = 3000;

const startServer = async () => {
  const port = process.env.SERVER_PORT || DEFAULT_PORT;

  app.listen(port, () => {
    connectDb();
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
