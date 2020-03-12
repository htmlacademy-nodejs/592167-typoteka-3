'use strict';

const postsRouter = require(`./posts`);

const initializeRoutes = (app) => {
  app.use(`/posts`, postsRouter);
};

module.exports = {
  initializeRoutes
};
