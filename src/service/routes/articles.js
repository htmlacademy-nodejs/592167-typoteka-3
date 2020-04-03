'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const commentService = require(`../control-utils/comment`);
const articleService = require(`../control-utils/article`);
const errors = require(`../errors/errors`);


router.get(`/`, (req, res) => {
  try {
    res.send(articleService.getContent());
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

router.get(`/:articleId`, (req, res) => {
  try {
    res.send(articleService.getContentById(req.params.articleId));
  } catch (err) {
    console.error(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    articleService.add(req.body);
    res.status(201).end();
  }
});

router.put(`/:articleId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({error: `Переданы не все поля для нового объявления.`});
  } else {
    articleService.change(req.body, req.params.articleId);
    res.status(201).end();
  }
});

router.delete(`/:articleId`, (req, res) => {
  try {
    articleService.remove(req.params.articleId);
    res.status(204).end();
  } catch (err) {
    console.log(chalk.red(err));
    if (err instanceof errors.ArticleNotFoundError) {
      res.status(410).send({code: 410, message: `article with id ${req.params.articleId} isn't found.`});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.get(`/:articleId/comments`, (req, res) => {
  try {
    res.send(commentService.getContent(req.params.articleId));
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

router.delete(`/:articleId/comments/:commentId`, (req, res) => {
  try {
    commentService.remove(req.params.articleId, req.params.commentId);
    res.status(204).end();
  } catch (err) {
    console.log(chalk.red(err));
    if (err instanceof errors.CommentNotFoundError) {
      res.status(410).send({code: 410, message: `comment with id ${req.params.commentId} isn't found`});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.put(`/:articleId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send(`Переданы не все поля для нового комментария.`);
  } else {
    commentService.add(req.body, req.params.articleId);
    res.status(201).end();
  }
});

module.exports = router;
