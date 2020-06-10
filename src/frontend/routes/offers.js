'use strict';

const axios = require(`axios`);
const { BACKEND_URL } = require(`../../constants`);

const {Router} = require(`express`);
const router = new Router();

router.get(`/category/:id`, (req, res) => res.send(req.originalUrl));
router.get(`/add`, (req, res) => {
  res.render(`new-post`);
});
router.get(`/edit/:id`, async (req, res) => {
  const response = await axios.get(`${BACKEND_URL}/api/articles/${req.params.id}`);
  // console.log(response.data);
  res.send(req.originalUrl)
});
router.get(`/:id`, (req, res) => res.send(req.originalUrl));

module.exports = router;
