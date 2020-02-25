'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/`, (req, res) => res.send(req.originalUrl));
router.get(`/comments`, (req, res) => res.send(req.originalUrl));

module.exports = router;
