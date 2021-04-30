'use strict';

const axios = require(`axios`);
const md5 = require(`md5`);
const {BACKEND_URL, USER_ROLE_GUEST, FRONTEND_URL, USER_ROLE_ADMIN, DEFAULT, NO_NAME_IMAGE} = require(`../../constants`);
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
  myArticles.userInfo = {
    userRole: USER_ROLE_ADMIN
  };
  res.render(`new-post`, {myArticles});
});

router.get(`/edit/:id`, [privatePath(true)], async (req, res) => {
  let queryStringForArticleEdit = `?extension=edit`;
  if (req.session && req.session.username) {
    queryStringForArticleEdit += `&username=${req.session.username}`;
  }
  const response = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}${queryStringForArticleEdit}`);
  const myArticles = response.data;
  const userInfo = {};
  if (myArticles.userInfoForArticleById.roleId) {
    userInfo.userName = `${myArticles.userInfoForArticleById.firstName} ${myArticles.userInfoForArticleById.lastName}`;
    userInfo.avatar = myArticles.userInfoForArticleById.avatar;
    userInfo.userRole = myArticles.userInfoForArticleById.roleId;
  } else {
    userInfo.userRole = USER_ROLE_GUEST;
  }
  myArticles.calendarDate = `${myArticles.createdAt.slice(6)}-${myArticles.createdAt.slice(3, 5)}-${myArticles.createdAt.slice(0, 2)}`;
  myArticles.action = `${BACKEND_URL}/api/articles/edit/${req.params.id}`;
  myArticles.userInfo = userInfo;
  console.log(myArticles);
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

    article.comments.map((it) => {
      it.userAvatar = it.userAvatar !== `` ? `/upload/${it.userAvatar}` : NO_NAME_IMAGE;
      return it;
    });

    const userInfo = {};
    if (article.userInfoForArticleById.roleId) {
      userInfo.userName = `${article.userInfoForArticleById.firstName} ${article.userInfoForArticleById.lastName}`;
      userInfo.avatar = article.userInfoForArticleById.avatar !== `` ? `/upload/${article.userInfoForArticleById.avatar}` : NO_NAME_IMAGE;
      userInfo.userRole = article.userInfoForArticleById.roleId;
      userInfo.email = req.session.username;
    } else {
      userInfo.userRole = USER_ROLE_GUEST;
      userInfo.avatar = NO_NAME_IMAGE;
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
    res.render(`errors/500`, {err});
  }
});

router.get(`/category/:id`, async (req, res) => {
  let queryStringForArticlesByCategoryId = `?start=1&count=8&offer=desc`;
  if (Object.keys(req.query).length !== 0) {
    queryStringForArticlesByCategoryId = `?start=${req.query.start}&count=${req.query.count}&offer=${req.query.offer}`;
  }
  if (req.session && req.session.isLogged) {
    queryStringForArticlesByCategoryId += `&username=${req.session.username}`;
  }
  const resArticlesForCategory = await axios.get(`${BACKEND_URL}/api/articles/categories/${req.params.id}${queryStringForArticlesByCategoryId}`);
  const articlesByCategory = resArticlesForCategory.data;
  const userInfo = {};
  if (articlesByCategory.userInfoArticlesForCategory.roleId) {
    userInfo.userName = `${articlesByCategory.userInfoArticlesForCategory.firstName} ${articlesByCategory.userInfoArticlesForCategory.lastName}`;
    userInfo.avatar = articlesByCategory.userInfoArticlesForCategory.avatar !== `` ? `/upload/${articlesByCategory.userInfoArticlesForCategory.avatar}` : NO_NAME_IMAGE;
    userInfo.userRole = articlesByCategory.userInfoArticlesForCategory.roleId;
  } else {
    userInfo.userRole = USER_ROLE_GUEST;
  }

  let paginationStep = [];
  const linkForward = {
    link: ``,
    disabled: true,
  };
  const linkBack = {
    link: ``,
    disabled: false,
  };
  if (articlesByCategory.pagination > DEFAULT.PREVIEWS_COUNT) {
    const tempCount = Math.floor(articlesByCategory.pagination / DEFAULT.PREVIEWS_COUNT);
    const paginationCount = (articlesByCategory.pagination % DEFAULT.PREVIEWS_COUNT > 0) ? tempCount + 1 : tempCount;
    paginationStep = Array(paginationCount).fill({}).map((it, i) => {
      if (i === 0 && !req.query.start) {
        linkBack.link = ``;
        linkBack.disabled = true;
        linkForward.link = `/articles/category/${req.params.id}?start=${i + 2}&count=8&offer=desc`;
        linkForward.disabled = false;
        return {
          step: i + 1,
          offset: true,
        };
      } else {
        if (Number.parseInt(req.query.start, 10) === i + 1) {
          linkBack.link = i === 0 ? `` : `/articles/category/${req.params.id}?start=${i}&count=8&offer=desc`;
          linkBack.disabled = i === 0;
          linkForward.link = i + 1 > tempCount ? `` : `/articles/category/${req.params.id}?start=${i + 2}&count=8&offer=desc`;
          linkForward.disabled = i === tempCount;
        }
        return {
          step: i + 1,
          offset: Number.parseInt(req.query.start, 10) === i + 1,
        };
      }
    });
  }
  const paginationVisible = DEFAULT.PREVIEWS_COUNT >= articlesByCategory.pagination;

  articlesByCategory.userInfo = userInfo;
  articlesByCategory.paginationStep = paginationStep;
  articlesByCategory.paginationVisible = paginationVisible;
  articlesByCategory.linkForward = linkForward;
  articlesByCategory.linkBack = linkBack;
  articlesByCategory.categoryId = req.params.id;
  res.render(`articles-by-category`, {articlesByCategory});
});

module.exports = router;
