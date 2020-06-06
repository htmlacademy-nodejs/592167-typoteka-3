'use strict';

const {Router} = require(`express`);
const router = new Router();

const axios = require(`axios`);
const {BACKEND_URL} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles`);
  console.log(response.data);
  res.render(`my`);
});
router.get(`/comments`, (req, res) => res.send(req.originalUrl));

module.exports = router;
