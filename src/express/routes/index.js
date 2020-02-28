'use strict';

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);

const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);

  app.get(`/`, (req, res) => {
    res.render(`main`);
  });
  app.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });
  app.get(`/login`, (req, res) => {
    res.render(`login`);
  });
  app.get(`/search`, (req, res) => {
    res.render(`search`);
  });
};

module.exports = {
  initializeRoutes
};
