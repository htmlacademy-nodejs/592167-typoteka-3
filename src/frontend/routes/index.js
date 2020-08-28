'use strict';

const axios = require(`axios`);
const {BACKEND_URL, DEFAULT} = require(`../../constants`);
const {cutString} = require(`../../utils`);

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
    previews.map((it) => {
      const dataCreate = new Date(it.createdAt);
      it.createdAt = createDateForPreview(dataCreate);
      return it;
    });

    const resMostDiscussed = await axios.get(`${BACKEND_URL}/api/articles/mostDiscussed`);
    const mostDiscussed = resMostDiscussed.data;
    mostDiscussed.map((it) => {
      it.announce = cutString(it.announce);
      return it;
    });

    const resComments = await axios.get(`${BACKEND_URL}/api/articles/comments`);
    const comments = resComments.data;
    comments.map((it) => {
      it.comment = cutString(it.comment);
      return it;
    });

    const resCategories = await axios.get(`${BACKEND_URL}/api/categories`);
    const categories = resCategories.data;

    // const resCountAllCategories = await axios.get(`${BACKEND_URL}/api/countAllCategories`);
    // const countAllCategories = resCountAllCategories.data;
    const countAllCategories = 6;

    let paginationStep = [];
    if (countAllCategories > DEFAULT.PREVIEWS_COUNT) {
      const tempCount = Math.floor(previews.length / DEFAULT.PREVIEWS_COUNT);
      const paginationCount = (previews.length % DEFAULT.PREVIEWS_COUNT > 0) ? tempCount + 1 : tempCount;
      paginationStep = Array(paginationCount).fill({}).map((it, i) => {
        return {
          step: i + 1,
          offset: Number.parseInt(req.params.start, 10) === i + 1,
        };
      });
    }


    const mainPage = {
      previews,
      comments,
      mostDiscussed,
      categories,
      paginationStep,
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
