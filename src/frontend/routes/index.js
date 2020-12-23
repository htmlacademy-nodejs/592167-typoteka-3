'use strict';

const axios = require(`axios`);
const {BACKEND_URL, DEFAULT, TEMPLATE} = require(`../../constants`);
const {cutString} = require(`../../utils`);

const userSchema = require(`../../validation-schemas/user-schema`);

const savePhoto = require(`../../middleware/save-photo`);
const schemaValidation = require(`../../middleware/schema-validator`);

const myRoutes = require(`./my`);
const articlesRoutes = require(`./articles`);
const errorsRoutes = require(`./errors`);
const categoriesRoutes = require(`./categories`);

const createDateForPreview = (date) => {
  const createDate = new Date(date);
  const tempMonth = `${createDate.getMonth()}`.padStart(2, `00`);
  return `${createDate.getDate()}.${tempMonth}.${createDate.getFullYear()}, ${createDate.getUTCHours()}:${createDate.getMinutes()}`;
};

const initializeRoutes = (app) => {
  app.use(`/my`, myRoutes);
  app.use(`/articles`, articlesRoutes);
  app.use(`/errors`, errorsRoutes);
  app.use(`/categories`, categoriesRoutes);

  app.get(`/`, async (req, res) => {
    let queryString = `?start=1&count=8&offer=desc`;
    if (Object.keys(req.query).length !== 0) {
      queryString = `?start=${req.query.start}&count=${req.query.count}&offer=${req.query.offer}`;
    }
    const resAllElements = await axios.get(`${BACKEND_URL}/api/articles${queryString}`);
    const allElements = resAllElements.data;

    allElements.previews.map((it) => {
      const dataCreate = new Date(it.createdAt);
      it.createdAt = createDateForPreview(dataCreate);
      return it;
    });

    allElements.lastComments.map((it) => {
      it.comment = cutString(it.comment);
      return it;
    });

    allElements.mostDiscussed.map((it) => {
      it.announce = cutString(it.announce);
      return it;
    });

    let paginationStep = [];
    if (allElements.pagination > DEFAULT.PREVIEWS_COUNT) {
      const tempCount = Math.floor(allElements.pagination / DEFAULT.PREVIEWS_COUNT);
      const paginationCount = (allElements.pagination % DEFAULT.PREVIEWS_COUNT > 0) ? tempCount + 1 : tempCount;
      paginationStep = Array(paginationCount).fill({}).map((it, i) => {
        return {
          step: i + 1,
          offset: Number.parseInt(req.query.start, 10) === i + 1,
        };
      });
    }

    const paginationVisible = DEFAULT.PREVIEWS_COUNT >= allElements.pagination;
    const mainPage = {
      previews: allElements.previews,
      comments: allElements.lastComments,
      mostDiscussed: allElements.mostDiscussed,
      categories: allElements.categories,
      paginationStep,
      paginationVisible,
    };
    res.render(`main`, {mainPage});
  });

  app.get(`/registration`, (req, res) => {
    res.render(`registration`);
  });

  app.post(`/registration`, [
    savePhoto(TEMPLATE.REGISTRATION),
    schemaValidation(userSchema, TEMPLATE.REGISTRATION),
  ], async (req, res) => {
    try {
      req.user.roleId = 3;
      await axios.post(`${BACKEND_URL}/api/users`, req.user);
      res.render(`sign-in`);
    } catch (err) {
      console.log(err);
      res.render(`errors/500`);
    }
  });

  app.get(`/sign-in`, (req, res) => {
    res.render(`sign-in`);
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
