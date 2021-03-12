'use strict';

const axios = require(`axios`);
const md5 = require(`md5`);
const {BACKEND_URL, USER_ROLE_GUEST, FRONTEND_URL} = require(`../../constants`);
const privatePath = require(`../../middleware/private`);
const testCsrf = require(`../../middleware/test-csrf`);

const {Router} = require(`express`);
const router = new Router();


router.get(`/add`, [privatePath(true)], async (req, res) => {
  const resCategories = await axios.get(`${BACKEND_URL}/api/categories?categoriesList=only`);
  const myArticles = {
    categories: resCategories.data,
  };
  myArticles.action = `${BACKEND_URL}/api/articles/add`;
  res.render(`new-post`, {myArticles});
});

router.get(`/edit/:id`, [privatePath(true)], async (req, res) => {
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
      userInfo.email = req.session.username;
    } else {
      userInfo.userRole = USER_ROLE_GUEST;
    }
    article.userInfo = userInfo;
    article.BACKEND_URL = BACKEND_URL;
    article.FRONTEND_URL = FRONTEND_URL;
    article.USER_ROLE_GUEST = USER_ROLE_GUEST;
    article.csrf = md5(req.session.cookie + process.env.CSRF_SECRET);
    console.log(article);
    return res.render(`post`, {article});
  } catch (err) {
    return res.render(`error/500`, {err});
  }
});

router.post(`/:id`, [testCsrf()], async (req, res) => {
  try {
    axios.post(`${BACKEND_URL}/api/articles/${req.params.id}/comments`, req.body);
    res.redirect(`/articles/${req.params.id}`);
  } catch (err) {
    res.render(`error/500`, {err});
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
