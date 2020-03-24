'use strict';

const articlesRouter = require(`./articles`);
const categoriesRouter = require(`./categories`);

const initializeRoutes = (app) => {
  app.use(`/api/articles`, articlesRouter);
  app.use(`/api/categories`, categoriesRouter);
};

module.exports = {
  initializeRoutes
};
