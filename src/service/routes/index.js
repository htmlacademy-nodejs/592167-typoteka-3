'use strict';

const articlesRouter = require(`./articles`);
const categoriesRouter = require(`./categories`);
const searchRouter = require(`./search`);

const initializeRoutes = (app) => {
  app.use(`/api/articles`, articlesRouter);
  app.use(`/api/categories`, categoriesRouter);
  app.use(`/api/search`, searchRouter);
};

module.exports = {
  initializeRoutes
};
