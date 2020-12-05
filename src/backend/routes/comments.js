'use strict';

const {Router} = require(`express`);
const {StatusCodes} = require(`http-status-codes`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const router = new Router();
const commentsService = require(`../services/comment`);


router.get(`/:userId`, async (req, res) => {
  try {
    res.send(await commentsService.getCommentsByUser(req.params.userId));
  } catch (err) {
    logger.error(err);
    res.status(500).send({code: 500, message: `Internal service error`});
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
