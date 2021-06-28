'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();
const commentsService = require(`../services/comment`);


router.get(`/`, async (req, res) => {
  try {
    return res.send(await commentsService.getComments());
  } catch (err) {
    logger.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({code: StatusCodes.INTERNAL_SERVER_ERROR, message: `Internal server error`});
  }
});

router.get(`/delete/:commentId`, async (req, res) => {
  try {
    await commentsService.remove(req.params.commentId);
    return res.json({isDelete: true});
  } catch (err) {
    logger.error(err);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({code: StatusCodes.INTERNAL_SERVER_ERROR, message: `Internal server error`});
  }
});

module.exports = router;
