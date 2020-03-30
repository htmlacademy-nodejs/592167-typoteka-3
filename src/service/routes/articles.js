'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const commentService = require(`../control-utils/comment`);
const articleService = require(`../control-utils/article`);


router.get(`/`, (req, res) => {
  try {
    res.send(articleService.getContent());
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});

router.get(`/:articleId`, (req, res) => {
  try {
    res.send(articleService.getContentById(req.params.articleId));
  } catch (err) {
    console.error(chalk.red(err));
    res.send([]);
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    const newId = articleService.add(req.body);
    res.status(201).send(`Новое заявление сохранено с id=${newId}`);
  }
});

router.put(`/:articleId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    articleService.change(req.body, req.params.articleId);
    res.status(201).send(`Данные успешно изменены.`);
  }
});

router.delete(`/:articleId`, (req, res) => {
  try {
    const isDelete = articleService.remove(req.params.articleId);
    res.status(isDelete.status).send(isDelete.text);
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});

router.get(`/:articleId/comments`, (req, res) => {
  try {
    res.send(commentService.getContent(req.params.articleId));
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});

router.delete(`/:articleId/comments/:commentId`, (req, res) => {
  try {
    const isDelete = commentService.remove(req.params.articleId, req.params.commentId);
    res.status(isDelete.status).send(isDelete.text);
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});

router.put(`/:articleId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send(`Переданы не все поля для нового комментария.`);
  } else {
    const commentId = commentService.add(req.body, req.params.articleId);
    res.status(201).send(`Новый комментарий сохранен с id=${commentId}.`);
  }
});

module.exports = router;
