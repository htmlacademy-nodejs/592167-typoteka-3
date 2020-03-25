'use strict';

const fs = require(`fs`);
const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);
const {addNewArticle, changeArticle, deleteArticle, deleteComment, addComment} = require(`../../utils`);
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
router.delete(`/:articleId`, (req, res) => {
  try {
    content = deleteArticle(content, req.params.articleId);
    content !== -1 ? res.send(content) : res.status(400).send(`Неудалось удалить заявление,
    так как оно не обнаружено в списке`);
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});
router.get(`/:articleId/comments`, (req, res) => {
  try {
    const article = content.find((el) => el.id === req.params.articleId.toString());
    res.send(article.comments);
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});
router.delete(`/:articleId/comments/:commentId`, (req, res) => {
  try {
    content = deleteComment(content, req.params.articleId, req.params.commentId);
    content !== -1 ? res.send(content) : res.status(400).send(`Невозможно удалить комментарий, так как
    он не обнаружен в списке.`);
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});
router.put(`/:articleId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send(`Переданы не все поля для нового комментария.`);
  } else {
    content = addComment(content, req.body, req.params.articleId);
    res.send(content);
  }
});

module.exports = router;