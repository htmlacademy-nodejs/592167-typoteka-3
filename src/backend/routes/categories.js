'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const categoriesService = require(`../services/categories`);

router.get(`/`, async (req, res) => {
  try {
    res.send(categoriesService.getCategories());
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

module.exports = router;
