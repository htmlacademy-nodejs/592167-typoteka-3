'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {StatusCode} = require(`http-status-codes`);

const router = new Router();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const commentService = require(`../services/comment`);
const articleService = require(`../services/article`);
const {ArticleNotFoundError, CommentNotFoundError} = require(`../errors/errors`);

const KEYS_COUNT_NEW_ANNONCEMENTS = 6;


router.get(`/`, async (req, res) => {
  try {
    const articles = await articleService.getAllElementsForMainPage(req.query);
    // const preparedListArticles = articles.slice(0).map((it) => {
    //   it.categories = it.categories.split(`, `);
    //   return it;
    // });
    res.send(articles);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/previewsForMainPage`, async (req, res) => {
  try {
    console.log(req.params, req.query);
    const articles = await articleService.getPreviewsForMainPage(req.query);
    const preparedListArticles = articles.slice(0).map((it) => {
      it.categories = it.categories.split(`, `);
      return it;
    });
    res.send(preparedListArticles);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/comments`, async (req, res) => {
  try {
    res.send(await articleService.getLastComments());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await articleService.getMostDiscussed());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.get(`/countAllArticles`, async (req, res) => {
  try {
    res.send(await articleService.getCountAllArticles());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal server error`});
  }
});

router.get(`/testSelect`, async (req, res) => {
  try {
    res.send(await articleService.testSelect());
  } catch (err) {
    logger.error(err);
  }
});

router.get(`/testCategory`, async (req, res) => {
  try {
    res.send(await articleService.testCategory());
  } catch (err) {
    logger.error(err);
  }
});

router.get(`/:articleId`, (req, res) => {
  try {
    res.send(articleService.findById(req.params.articleId));
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(StatusCode.GONE).send({code: StatusCode.GONE, message: err.message});
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.post(`/`, (req, res) => {
  if (Object.keys(req.body).length !== KEYS_COUNT_NEW_ANNONCEMENTS) {
    res.status(StatusCode.BAD_REQUEST).send({code: 1, message: `Not all fields for a new article have been submitted`});
  } else {
    try {
      const id = articleService.create(req.body);
      res.status(StatusCode. CREATED).send({id});
      logger.info(`End request with status code ${res.statusCode}`);
    } catch (err) {
      logger.error(chalk.red(err));
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.put(`/:articleId`, (req, res) => {
  if (Object.keys(req.body).length !== KEYS_COUNT_NEW_ANNONCEMENTS) {
    res.status(StatusCode.BAD_REQUEST).send({code: 1, message: `Not all fields for a new article have been submitted`});
  } else {
    try {
      const id = articleService.update(req.body, req.params.articleId);
      res.status(StatusCode.CREATED).send({id});
      logger.info(`End request with status code ${res.statusCode}`);
    } catch (err) {
      logger.error(chalk.red(err));
      if (err instanceof ArticleNotFoundError) {
        res.status(StatusCode.GONE).send({code: StatusCode.GONE, message: err.message});
      } else {
        res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
      }
    }
  }
});

router.delete(`/:articleId`, (req, res) => {
  try {
    articleService.remove(req.params.articleId);
    res.status(StatusCode.NO_CONTENT).end();
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(StatusCode.GONE).send({code: StatusCode.GONE, message: err.message});
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.get(`/:articleId/comments`, (req, res) => {
  try {
    res.send(commentService.getByArticleId(req.params.articleId));
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(StatusCode.GONE).send({code: StatusCode.GONE, message: err.message});
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.delete(`/:articleId/comments/:commentId`, (req, res) => {
  try {
    commentService.remove(req.params.articleId, req.params.commentId);
    res.status(StatusCode.NO_CONTENT).end();
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof CommentNotFoundError) {
      res.status(StatusCode.GONE).send({code: StatusCode.GONE, message: err.message});
    } else {
      res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
    }
  }
});

router.post(`/:articleId/comments`, (req, res) => {
  if (Object.keys(req.body).length !== 1) {
    res.status(StatusCode.BAD_REQUEST).send({code: 2, message: `Not all fields for a new comment have been submitted`});
  } else {
    const id = commentService.add(req.body, req.params.articleId);
    res.status(StatusCode.CREATED).send({id});
    logger.info(`End request with status code ${res.statusCode}`);
  }
});

module.exports = router;
