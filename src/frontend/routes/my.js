'use strict';

const {Router} = require(`express`);
const router = new Router();

const privatePath = require(`../../middleware/private`);

const axios = require(`axios`);
const {BACKEND_URL, MOCK_USER_ID} = require(`../../constants`);

router.get(`/`, [privatePath(true)], async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles/myArticles`);
  const myArticles = response.data;
  res.render(`my`, {myArticles});
});

router.get(`/comments`, [privatePath(true)], async (req, res) => {
  const commentsList = await axios.get(`${BACKEND_URL}/api/comments/${MOCK_USER_ID}`);
  const comments = commentsList.data;
  res.render(`comments`, {comments});
});


module.exports = router;
