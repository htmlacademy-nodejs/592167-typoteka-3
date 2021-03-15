'use strict';

const axios = require(`axios`);

const {TEMPLATE, BACKEND_URL, LOGIN_MESSAGE} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    try {
      await axios.post(`${BACKEND_URL}/api/users/check-password`, req.body);
      next();
    } catch (err) {
      res.render(TEMPLATE.LOGIN, {
        errorMessage: LOGIN_MESSAGE.BAD_LOGIN,
      });
    }
  }
);
