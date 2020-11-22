'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const {BACKEND_URL, MOCK_USER_ID} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles/myArticles`);
  const articles = response.data;
  res.render(`my`, {articles});
});

router.get(`/comments`, async (req, res) => {
  const commentsList = await axios.get(`${BACKEND_URL}/api/comments/${MOCK_USER_ID}`);
  const comments = commentsList.data;
  res.render(`comments`, {comments});
});


module.exports = router;
