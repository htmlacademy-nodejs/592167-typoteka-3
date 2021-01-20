'use strict';

const articlesRouter = require(`./articles`);
const categoriesRouter = require(`./categories`);
const searchRouter = require(`./search`);
const commentsRouter = require(`./comments`);
const usersRouter = require(`./users`);

const initializeRoutes = (app) => {
  app.use(`/api/articles`, articlesRouter);
  app.use(`/api/categories`, categoriesRouter);
  app.use(`/api/search`, searchRouter);
  app.use(`/api/comments`, commentsRouter);
  app.use(`/api/users`, usersRouter);
};

module.exports = {
  initializeRoutes
};
