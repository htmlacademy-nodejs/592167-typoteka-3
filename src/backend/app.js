'use strict';

const express = require(`express`);
const {initializeRoutes} = require(`./routes/index`);
const {getLogger} = require(`./logger`);
const logger = getLogger();

const app = express();

app.use((req, res, next) => {
  res.on(`finish`, () => {
    logger.info(`End request with status code ${res.statusCode}`);
  });
  logger.debug(`Start request tot url ${req.url}`);
  next();
});

app.use(express.json());
initializeRoutes(app);
app.use((req, res) => {
  res.status(404).send({code: 404, message: `Page not found`});
  logger.error(`End request with error ${res.statusCode}`);
});

module.exports = app;
