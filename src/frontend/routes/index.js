'use strict';

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);

const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);

  app.get(`/`, async (req, res) => {
    const resPreviews = await axios.get(`${BACKEND_URL}/api/articles/previews`);
    const resMostDiscussed = await axios.get(`${BACKEND_URL}/api/articles/mostDiscussed`);
    const resComments = await axios.get(`${BACKEND_URL}/api/articles/comments`);
    const previews = resPreviews.data;
    const comments = resComments.data;
    const mostDiscussed = resMostDiscussed.data;
    const mainPage = {
      previews,
      comments,
      mostDiscussed,
    };
    res.render(`main`, {mainPage});
  });

  app.get(`/register`, (req, res) => {
    res.render(`sign-up`);
  });

  app.get(`/login`, (req, res) => {
    res.render(`login`);
  });

  app.get(`/search`, async (req, res) => {
    const response = await axios.get(encodeURI(`${BACKEND_URL}/api/search?query=${req.query.search}`));
    const searchResult = response.data;
    res.render(`search`, {searchResult});
  });
};

module.exports = {
  initializeRoutes
};
