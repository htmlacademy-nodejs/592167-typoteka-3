'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);

const router = new Router();

const commentService = require(`../services/comment`);
const articleService = require(`../services/article`);
const {ArticleNotFoundError, CommentNotFoundError} = require(`../errors/errors`);


router.get(`/`, (req, res) => {
  try {
    res.send(articleService.findAll());
  } catch (err) {
    console.log(chalk.red(err));
    res.status(500).send({code: 500, message: `Internal service error`});
  }
});

router.get(`/:articleId`, (req, res) => {
  try {
    res.send(articleService.findById(req.params.articleId));
  } catch (err) {
    console.error(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(410).send({code: 410, message: err.message});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({code: 1, message: `Not all fields for a new article have been submitted`});
  } else {
    try {
      const id = articleService.create(req.body);
      res.status(201).send({id});
    } catch (err) {
      console.error(chalk.red(err));
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.put(`/:articleId`, (req, res) => {
  if (Object.keys(req.body).length !== 6) {
    res.status(400).send({code: 1, message: `Not all fields for a new article have been submitted`});
  } else {
    try {
      const id = articleService.update(req.body, req.params.articleId);
      res.status(201).send({id});
    } catch (err) {
      console.error(chalk.red(err));
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.delete(`/:articleId`, (req, res) => {
  try {
    articleService.remove(req.params.articleId);
    res.status(204).end();
  } catch (err) {
    console.log(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(410).send({code: 410, message: err.message});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.get(`/:articleId/comments`, (req, res) => {
  try {
    res.send(commentService.getByArticleId(req.params.articleId));
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
    if (err instanceof CommentNotFoundError) {
      res.status(410).send({code: 410, message: err.message});
    } else {
      res.status(500).send({code: 500, message: `Internal service error`});
    }
  }
});

router.post(`/:articleId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(400).send(`Not all fields for a new comment have been submitted`);
  } else {
    const id = commentService.add(req.body, req.params.articleId);
    res.status(201).send({id});
  }
});

module.exports = router;
