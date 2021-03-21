'use strict';

const {Router} = require(`express`);
const router = new Router();

const privatePath = require(`../../middleware/private`);

const axios = require(`axios`);
const {BACKEND_URL, MOCK_USER_ID, USER_ROLE_ADMIN} = require(`../../constants`);

router.get(`/`, [privatePath(true)], async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles/myArticles`);
  const myArticles = response.data;
  myArticles.userInfo = {
    userRole: USER_ROLE_ADMIN
  };
  res.render(`my`, {myArticles});
});

router.get(`/comments`, [privatePath(true)], async (req, res) => {
  const commentsList = await axios.get(`${BACKEND_URL}/api/comments/${MOCK_USER_ID}`);
  const comments = commentsList.data;
  comments.userInfo = {
    userRole: USER_ROLE_ADMIN
  };
  res.render(`comments`, {comments});
});


module.exports = router;
