'use strict';

const axios = require(`axios`);
const md5 = require(`md5`);
const {BACKEND_URL, DEFAULT, TEMPLATE} = require(`../../constants`);
const {cutString} = require(`../../utils`);

const userSchema = require(`../../validation-schemas/user-schema`);

const savePhoto = require(`../../middleware/save-photo`);
const alreadyRegister = require(`../../middleware/already-register`);
const schemaValidation = require(`../../middleware/schema-validator`);
const userIsNotRegister = require(`../../middleware/user-is-not-register`);
const checkUserPassword = require(`../../middleware/check-user-password`);
const testCsrf = require(`../../middleware/test-csrf`);

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
    if (req.session && req.session.isLogged) {
      queryString += `&username=${req.session.username}`;
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
      it.userName = `${it.users.firstName} ${it.users.lastName}`;
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

    const userInfo = {};
    if (allElements.userInfo.roleId) {
      userInfo.userName = `${allElements.userInfo.firstName} ${allElements.userInfo.lastName}`;
      userInfo.avatar = allElements.userInfo.avatar;
      userInfo.userRole = allElements.userInfo.roleId;
    } else {
      userInfo.userRole = 3;
    }

    const paginationVisible = DEFAULT.PREVIEWS_COUNT >= allElements.pagination;
    const mainPage = {
      previews: allElements.previews,
      comments: allElements.lastComments,
      mostDiscussed: allElements.mostDiscussed,
      categories: allElements.categories,
      paginationStep,
      paginationVisible,
      userInfo,
    };
    res.render(`main`, {mainPage});
  });

  app.get(`/register`, (req, res) => {
    res.render(`registration`);
  });

  app.post(`/register`, [
    savePhoto(TEMPLATE.REGISTRATION),
    schemaValidation(userSchema, TEMPLATE.REGISTRATION),
    alreadyRegister(),
  ], async (req, res) => {
    try {
      await axios.post(`${BACKEND_URL}/api/users`, req.user);
      res.redirect(`/login`);
    } catch (err) {
      console.log(err);
      res.render(`errors/500`);
    }
  });

  app.get(`/login`, (req, res) => {
    const csrf = md5(req.session.cookie + process.env.CSRF_SECRET);
    res.render(`login`, {csrfToken: csrf});
  });

  app.post(`/login`, [
    testCsrf(),
    userIsNotRegister(),
    checkUserPassword(),
  ], (req, res) => {
    req.session.isLogged = true;
    req.session.username = req.body.email;
    res.redirect(`/`);
  });

  app.get(`/logout`, (req, res) => {
    req.session.destroy();
    res.redirect(`/login`);
  });

  app.get(`/search`, async (req, res) => {
    let searchQueryString = `?query=${req.query.search}`;
    if (req.session && req.session.isLogged) {
      searchQueryString += `&username=${req.session.username}`;
    }
    const response = await axios.get(encodeURI(`${BACKEND_URL}/api/search${searchQueryString}`));
    const searchResult = response.data;
    const userInfo = {};
    if (searchResult.userInfoForSearch.roleId) {
      userInfo.userName = `${searchResult.userInfoForSearch.firstName} ${searchResult.userInfoForSearch.lastName}`;
      userInfo.avatar = searchResult.userInfoForSearch.avatar;
      userInfo.userRole = searchResult.userInfoForSearch.roleId;
    } else {
      userInfo.userRole = 3;
    }
    searchResult.userInfo = userInfo;
    res.render(`search`, {searchResult});
  });
};

module.exports = {
  initializeRoutes
};
