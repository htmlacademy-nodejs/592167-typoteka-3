'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

const MAX_ARTICLES_COMMENTS = 3;

router.get(`/`, async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles`);
  const articles = response.data;
  res.render(`my`, {articles});
});

router.get(`/comments`, async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles`);
  const articles = response.data;
  const amountOfArticles = Math.min(MAX_ARTICLES_COMMENTS, articles.length);
  const commentsOnArticles = articles.slice(0, amountOfArticles);
  console.log(commentsOnArticles);
  res.render(`comments`);
});

module.exports = router;
