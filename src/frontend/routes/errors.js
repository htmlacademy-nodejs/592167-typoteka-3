'use strict';

const {Router} = require(`express`);
const router = new Router();

router.get(`/400`, (req, res) => {
  res.render(`errors/400`);
});

router.get(`/500`, (req, res) => {
  res.render(`errors/500`);
});

module.exports = router;
