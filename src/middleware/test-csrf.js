'use strict';

const md5 = require(`md5`);

module.exports = () => (
  async (req, res, next) => {
    if (req.body.csrf === md5(req.session.cookie + process.env.CSRF_SECRET)) {
      next();
    } else {
      res.redirect(`/login`);
    }
  }
);
