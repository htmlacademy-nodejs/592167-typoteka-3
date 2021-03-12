'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {StatusCodes} = require(`http-status-codes`);

const router = new Router();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const commentService = require(`../services/comment`);
const articleService = require(`../services/article`);
const savePhoto = require(`../../middleware/save-photo`);
const {ArticleNotFoundError} = require(`../errors/errors`);
const {MOCK_USER_ID, FRONTEND_URL, TEMPLATE} = require(`../../constants`);


router.get(`/`, async (req, res) => {
  try {
    const articles = await articleService.getAllElementsForMainPage(req.query);
    res.send(articles);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/previewsForMainPage`, async (req, res) => {
  try {
    const articles = await articleService.getPreviewsForMainPage(req.query);
    const preparedListArticles = articles.slice(0).map((it) => {
      it.categories = it.categories.split(`, `);
      return it;
    });
    res.send(preparedListArticles);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/comments`, async (req, res) => {
  try {
    res.send(await articleService.getLastComments());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/mostDiscussed`, async (req, res) => {
  try {
    res.send(await articleService.getMostDiscussed());
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/countAllArticles`, async (req, res) => {
  try {
    res.send(await articleService.getCountAllArticles());
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});

router.get(`/myArticles`, async (req, res) => {
  try {
    res.send(await articleService.getMyArticles(MOCK_USER_ID));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});


router.get(`/categories/:id`, async (req, res) => {
  try {
    res.send(await articleService.getArticlesForCategory(req.params.id, req.query));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});

router.get(`/:articleId`, async (req, res) => {
  try {
    if (req.query.extension === `isFetch`) {
      res.json(await articleService.getArticleById(req.params.articleId, {extension: `edit`}));
    } else {
      res.send(await articleService.getArticleById(req.params.articleId, req.query));
    }
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    if (err instanceof ArticleNotFoundError) {
      res.status(StatusCodes.GONE).send({code: StatusCodes.GONE, message: err.message});
    } else {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: `Internal service error`
      });
    }
  }
});

router.post(`/add`, savePhoto(TEMPLATE.NEW_POST), async (req, res) => {
  try {
    const data = req.body;
    data.image = req.file !== undefined ? req.file.filename : ``;

    await articleService.create(data);
    res.redirect(`${FRONTEND_URL}/my`);
  } catch (err) {
    res.send(err);
  }
});

router.post(`/:articleId/comments`, async (req, res) => {
  try {
    const data = req.body;
    data.articleId = req.params.articleId;
    commentService.add(data);
    // res.redirect(`${FRONTEND_URL}/articles/${req.params.articleId}`);
    res.sendStatus(StatusCodes.OK);
    logger.info(`End request with status code ${res.statusCode}`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.post(`/edit/:articleId`, savePhoto(TEMPLATE.NEW_POST), async (req, res) => {
  try {
    const data = req.body;
    data.image = req.file !== undefined ? req.file.filename : ``;

    await articleService.edit(data, req.params.articleId);
    res.redirect(`${FRONTEND_URL}/my`);
  } catch (err) {
    res.send(``);
  }
});

router.get(`/delete/:articleId`, async (req, res) => {
  try {
    await articleService.remove(req.params.articleId);
    return res.json({isDelete: true});
  } catch (err) {
    logger.error(err);
    return res.json({isDeleted: `${err.message}`});
  }
});


module.exports = router;
