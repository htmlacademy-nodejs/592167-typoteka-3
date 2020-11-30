'use strict';

const {Router} = require(`express`);
const chalk = require(`chalk`);
const {StatusCode} = require(`http-status-codes`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const categoriesService = require(`../services/categories`);

const {FRONTEND_URL} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  try {
    res.send(await categoriesService.getCategories(req.query.categoriesList));
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.post(`/add`, async (req, res) => {
  try {
    await categoriesService.create(req.body);
    res.redirect(`${FRONTEND_URL}/categories`);
  } catch (err) {
    logger.error(err);
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.post(`/edit/:categoryId`, async (req, res) => {
  try {
    console.log(req.body);
    await categoriesService.edit(req.body, req.params.categoryId);
    res.redirect(`${FRONTEND_URL}/categories`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

router.post(`/remove/:categoryId`, async (req, res) => {
  try {
    res.send(`/remove/:categoryId`);
  } catch (err) {
    logger.error(chalk.red(err));
    res.status(StatusCode.INTERNAL_SERVER_ERROR).send({code: StatusCode.INTERNAL_SERVER_ERROR, message: `Internal service error`});
  }
});

module.exports = router;
