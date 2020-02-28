'use strict';

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);

const initializeRoutes = (app) => {
  app.set(`views`, `${__dirname}/../templates`);
  app.set(`view engine`, `pug`);

  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);

  app.get(`/`, (req, res) => {
    res.send(req.url);
  });
  app.get(`/register`, (req, res) => {
    res.send(req.url);
  });
  app.get(`/login`, (req, res) => {
    res.send(req.url);
  });
  app.get(`/search`, (req, res) => {
    res.send(req.url);
  });
};

module.exports = {
  initializeRoutes
};
