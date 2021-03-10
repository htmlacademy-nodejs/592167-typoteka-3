'use strict';

// const axios = require(`axios`);
const {} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    if (req.session.isLogged) {
      console.log(`We will be check user role`);
      next();
    } else {
      res.redirect(`/sign-in`);
    }
  }
);
