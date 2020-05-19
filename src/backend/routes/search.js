'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const articleService = require(`../services/article`);

router.get(`/`, (req, res) => {
  try {
    res.send(articleService.search(req.query.query));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

module.exports = router;
