'use strict';

const {Router} = require(`express`);
const axios = require(`axios`);
const router = new Router();
const privatePath = require(`../../middleware/private`);

const {BACKEND_URL, USER_ROLE_ADMIN} = require(`../../constants`);

router.get(`/`, [privatePath(true)], async (req, res) => {
  const categoriesList = await axios.get(`${BACKEND_URL}/api/categories?categoriesList=only`);
  const categories = categoriesList.data;
  categories.BACKEND_URL = BACKEND_URL;
  categories.userInfo = {
    userRole: USER_ROLE_ADMIN
  };
  res.render(`all-categories`, {categories});
});

module.exports = router;
