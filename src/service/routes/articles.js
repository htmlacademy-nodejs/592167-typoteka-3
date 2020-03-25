'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);
const {addNewArticle, changeArticle} = require(`../../utils`);
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
router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`})
  } else {
    content = addNewArticle(content, req.body);
    res.send(content);
  }
});
router.put(`/:articleId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`})
  } else {
    content = changeArticle(content, req.body, req.params.articleId);
    res.send(content);
  }
});

module.exports = router;
