'use strict';

const {Router} = require(`express`);

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

module.exports = router;
