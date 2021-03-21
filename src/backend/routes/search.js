'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();

const articleService = require(`../services/article`);

router.get(`/`, async (req, res) => {
  try {
    res.send(await articleService.search(req.query));
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal server error`
    });
  }
});

module.exports = router;
