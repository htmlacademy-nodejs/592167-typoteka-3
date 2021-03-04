'use strict';

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

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
  const response = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}?extension=edit`);
  const myArticles = response.data;
  myArticles.action = `${BACKEND_URL}/api/articles/edit/${req.params.id}`;
  res.render(`new-post`, {myArticles});
});

router.get(`/:id`, async (req, res) => {
  try {
    const resGetArticle = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}?extension=post-info`);
    const article = resGetArticle.data;
    return res.render(`post`, {article});
  } catch (err) {
    return res.render(`error/500`, {err});
  }
});

router.get(`/category/:id`, async (req, res) => {
  const resArticlesForCategory = await axios.get(`${BACKEND_URL}/api/articles/categories/${req.params.id}`);
  const articlesByCategory = resArticlesForCategory.data;
  res.render(`articles-by-category`, {articlesByCategory});
});

module.exports = router;
