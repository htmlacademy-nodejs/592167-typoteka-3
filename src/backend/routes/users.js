'use strict';

const {Router} = require(`express`);
const router = new Router();
const {StatusCodes} = require(`http-status-codes`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const userServices = require(`../services/users`);

router.post(`/`, async (req, res) => {
  try {
    res.send(await userServices.add(req.body));
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

router.get(`/check`, async (req, res) => {
  try {
    res.send(await userServices.checkUser(req.query.email));
  } catch (err) {
    logger.error(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      code: StatusCodes.INTERNAL_SERVER_ERROR,
      message: `Internal service error`
    });
  }
});

module.exports = router;
