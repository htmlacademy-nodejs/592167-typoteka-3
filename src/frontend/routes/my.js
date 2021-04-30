'use strict';

const {Router} = require(`express`);
const router = new Router();

const privatePath = require(`../../middleware/private`);

const axios = require(`axios`);
const {BACKEND_URL, USER_ROLE_ADMIN, NO_NAME_IMAGE} = require(`../../constants`);

router.get(`/`, [privatePath(true)], async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles/myArticles`);
  const myArticles = response.data;
  myArticles.userInfo = {
    userRole: USER_ROLE_ADMIN
  };
  res.render(`my`, {myArticles});
});

router.get(`/comments`, [privatePath(true)], async (req, res) => {
  const commentsList = await axios.get(`${BACKEND_URL}/api/comments`);
  const comments = commentsList.data;
  comments.map((it) => {
    it.avatar = it.avatar !== `` ? `/upload/${it.avatar}` : NO_NAME_IMAGE;
  });
  comments.userInfo = {
    userRole: USER_ROLE_ADMIN
  };
  res.render(`comments`, {comments});
});


module.exports = router;
