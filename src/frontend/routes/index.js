'use strict';

const axios = require(`axios`);
const md5 = require(`md5`);
const {BACKEND_URL, DEFAULT, TEMPLATE, USER_ROLE_GUEST, NO_NAME_IMAGE} = require(`../../constants`);
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

const {generateDate} = require(`../../utils`);

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
      // const dataCreate = new Date(it.createdAt);
      it.createdAt = generateDate(it.createdAt);
      return it;
    });

    allElements.lastComments.map((it) => {
      it.comment = cutString(it.comment);
      it.userName = `${it.users.firstName} ${it.users.lastName}`;
      it.avatar = it.users.avatar !== `` ? `/upload/${it.users.avatar}` : NO_NAME_IMAGE;
      return it;
    });

    allElements.mostDiscussed.map((it) => {
      it.announce = cutString(it.announce);
      return it;
    });

    let paginationStep = [];
    const linkForward = {
      link: ``,
      disabled: true,
    };
    const linkBack = {
      link: ``,
      disabled: false,
    };
    if (allElements.pagination > DEFAULT.PREVIEWS_COUNT) {
      const tempCount = Math.floor(allElements.pagination / DEFAULT.PREVIEWS_COUNT);
      const paginationCount = (allElements.pagination % DEFAULT.PREVIEWS_COUNT > 0) ? tempCount + 1 : tempCount;
      paginationStep = Array(paginationCount).fill({}).map((it, i) => {
        if (i === 0 && !req.query.start) {
          linkBack.link = ``;
          linkBack.disabled = true;
          linkForward.link = `/?start=${i + 2}&count=8&offer=desc`;
          linkForward.disabled = false;
          return {
            step: i + 1,
            offset: true,
          };
        } else {
          if (Number.parseInt(req.query.start, 10) === i + 1) {
            linkBack.link = i === 0 ? `` : `/?start=${i}&count=8&offer=desc`;
            linkBack.disabled = i === 0;
            linkForward.link = i + 1 > tempCount ? `` : `/?start=${i + 2}&count=8&offer=desc`;
            linkForward.disabled = i === tempCount;
          }
          return {
            step: i + 1,
            offset: Number.parseInt(req.query.start, 10) === i + 1,
          };
        }
      });
    }

    const userInfo = {};
    if (allElements.userInfo.roleId) {
      userInfo.userName = `${allElements.userInfo.firstName} ${allElements.userInfo.lastName}`;
      userInfo.avatar = allElements.userInfo.avatar !== `` ? `/upload/${allElements.userInfo.avatar}` : NO_NAME_IMAGE;
      userInfo.userRole = allElements.userInfo.roleId;
    } else {
      userInfo.userRole = USER_ROLE_GUEST;
      userInfo.avatar = NO_NAME_IMAGE;
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
      linkForward,
      linkBack,
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
    const userInfo = {};
    let searchResult = {};
    if (req.session && req.session.isLogged) {
      const resUserInfo = await axios.get(`${BACKEND_URL}/api/users/info?email=${req.session.username}`);
      if (resUserInfo.data.roleId) {
        userInfo.userName = `${resUserInfo.data.firstName} ${resUserInfo.data.lastName}`;
        userInfo.avatar = resUserInfo.data.avatar !== `` ? `/upload/${resUserInfo.data.avatar}` : NO_NAME_IMAGE;
        userInfo.userRole = resUserInfo.data.roleId;
      } else {
        userInfo.userRole = USER_ROLE_GUEST;
        userInfo.avatar = NO_NAME_IMAGE;
      }
    }
    if (req.query.search) {
      const response = await axios.get(encodeURI(`${BACKEND_URL}/api/search?query=${req.query.search}`));
      searchResult = response.data;
    }
    searchResult.userInfo = userInfo;
    res.render(`search`, {searchResult});
  });
};

module.exports = {
  initializeRoutes
};
