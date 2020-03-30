'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const articleService = require(`../control-utils/article`);

router.get(`/`, (req, res) => {
  try {
    res.send(articleService.search(req.query));
  } catch (err) {
    console.log(chalk.red(err));
    res.status(404).send(`Нет такой страницы.`);
  }
});

module.exports = router;
