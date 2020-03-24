'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];


router.get(`/`, (req, res) => {
  try {
    res.send(content);
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});
router.get(`/:articleId`, (req, res) => {
  try {
    res.send(content.filter((el) => el.id === req.params.articleId.toString()));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

module.exports = router;
