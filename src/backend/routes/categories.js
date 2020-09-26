'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const categoriesService = require(`../services/categories`);

router.get(`/`, async (req, res) => {
  try {
    res.send(await categoriesService.getCategories());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

module.exports = router;
