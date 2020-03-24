'use strict';

const articlesRouter = require(`./articles`);

const initializeRoutes = (app) => {
  app.use(`/api/articles`, articlesRouter);
};

module.exports = {
  initializeRoutes
};
