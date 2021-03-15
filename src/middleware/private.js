'use strict';

const axios = require(`axios`);
const {BACKEND_URL} = require(`../constants`);

module.exports = (checkAdmin = false) => (
  async (req, res, next) => {
    if (req.session.isLogged) {
      if (checkAdmin) {
        const userInfo = await axios.get(`${BACKEND_URL}/api/users/check-admin?email=${req.session.username}`);
        const {isAdmin} = userInfo.data;
        if (!isAdmin) {
          const linkBack = req.headers.referer ? req.headers.referer.split(req.headers.host)[1] : `/`;
          res.redirect(linkBack);
          return;
        }
      }
      next();
    } else {
      res.redirect(`/sign-in`);
    }
  }
);
