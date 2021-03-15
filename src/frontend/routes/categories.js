'use strict';

const {Router} = require(`express`);
const axios = require(`axios`);
const router = new Router();
const privatePath = require(`../../middleware/private`);

const {BACKEND_URL} = require(`../../constants`);

router.get(`/`, [privatePath()], async (req, res) => {
  const categoriesList = await axios.get(`${BACKEND_URL}/api/categories?categoriesList=only`);
  const categories = categoriesList.data;
  res.render(`all-categories`, {categories});
});

module.exports = router;
