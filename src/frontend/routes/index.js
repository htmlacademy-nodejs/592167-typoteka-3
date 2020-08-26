'use strict';

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

const myRoutes = require(`./my`);
const offersRoutes = require(`./offers`);

const createDateForPreview = (date) => {
  const createDate = new Date(date);
  const tempMonth = (createDate.getMonth() + 1) < 10 ? `0${createDate.getMonth() + 1}` : `${createDate.getMonth()}`;
  return `${createDate.getDate()}.${tempMonth}.${createDate.getFullYear()}, ${createDate.getUTCHours()}:${createDate.getMinutes()}`;
};

const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/offers`, offersRoutes);

  app.get(`/`, async (req, res) => {
    const resPreviews = await axios.get(`${BACKEND_URL}/api/articles/previewsForMainPage`);
    const previews = resPreviews.data;

    const resMostDiscussed = await axios.get(`${BACKEND_URL}/api/articles/mostDiscussed`);
    const mostDiscussed = resMostDiscussed.data;

    const resComments = await axios.get(`${BACKEND_URL}/api/articles/comments`);
    const comments = resComments.data;

    const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
    const categories = resCategories.data;

    previews.map((it) => {
      const dataCreate = new Date(it.createdAt);
      it.createdAt = createDateForPreview(dataCreate);
      return it;
    });
    const mainPage = {
      previews,
      comments,
      mostDiscussed,
      categories,
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
