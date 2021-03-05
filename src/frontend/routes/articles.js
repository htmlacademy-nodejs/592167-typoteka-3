'use strict';

const axios = require(`axios`);
const {BACKEND_URL, USER_ROLE_GUEST} = require(`../../constants`);

const {Router} = require(`express`);
const router = new Router();


router.get(`/add`, async (req, res) => {
  const resCategories = await axios.get(`${BACKEND_URL}/api/categories?categoriesList=only`);
  const myArticles = {
    categories: resCategories.data,
  };
  myArticles.action = `${BACKEND_URL}/api/articles/add`;
  res.render(`new-post`, {myArticles});
});

router.get(`/edit/:id`, async (req, res) => {
  let queryStringForArticleEdit = `?extension=edit`;
  if (req.session && req.session.username) {
    queryStringForArticleEdit += `&username=${req.session.username}`;
  }
  const response = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}${queryStringForArticleEdit}`);
  const myArticles = response.data;
  myArticles.action = `${BACKEND_URL}/api/articles/edit/${req.params.id}`;
  res.render(`new-post`, {myArticles});
});

router.get(`/:id`, async (req, res) => {
  try {
    let queryStringForArticleInfo = `?extension=post-info`;
    if (req.session && req.session.username) {
      queryStringForArticleInfo += `&username=${req.session.username}`;
    }
    const resGetArticle = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}${queryStringForArticleInfo}`);
    const article = resGetArticle.data;
    const userInfo = {};
    if (article.userInfoForArticleById.roleId) {
      userInfo.userName = `${article.userInfoForArticleById.firstName} ${article.userInfoForArticleById.lastName}`;
      userInfo.avatar = article.userInfoForArticleById.avatar;
      userInfo.userRole = article.userInfoForArticleById.roleId;
    } else {
      userInfo.userRole = USER_ROLE_GUEST;
    }
    article.userInfo = userInfo;
    article.BACKEND_URL = BACKEND_URL;
    article.USER_ROLE_GUEST = USER_ROLE_GUEST;
    return res.render(`post`, {article});
  } catch (err) {
    return res.render(`error/500`, {err});
  }
});

router.get(`/category/:id`, async (req, res) => {
  const queryStringForArticlesByCategoryId = (req.session && req.session.username) ? `?username=${req.session.username}` : ``;
  const resArticlesForCategory = await axios.get(`${BACKEND_URL}/api/articles/categories/${req.params.id}${queryStringForArticlesByCategoryId}`);
  const articlesByCategory = resArticlesForCategory.data;
  const userInfo = {};
  if (articlesByCategory.userInfoArticlesForCategory.roleId) {
    userInfo.userName = `${articlesByCategory.userInfoArticlesForCategory.firstName} ${articlesByCategory.userInfoArticlesForCategory.lastName}`;
    userInfo.avatar = articlesByCategory.userInfoArticlesForCategory.avatar;
    userInfo.userRole = articlesByCategory.userInfoArticlesForCategory.roleId;
  } else {
    userInfo.userRole = USER_ROLE_GUEST;
  }
  articlesByCategory.userInfo = userInfo;
  res.render(`articles-by-category`, {articlesByCategory});
});

module.exports = router;
