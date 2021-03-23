'use strict';

const axios = require(`axios`);

const {TEMPLATE, BACKEND_URL, LOGIN_MESSAGE} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    const resUserCheck = await axios.get(`${BACKEND_URL}/api/users/check?email=${req.body.email}`);
    const {userRegister} = resUserCheck.data;
    if (userRegister) {
      next();
    } else {
      res.render(TEMPLATE.LOGIN, {
        errorMessage: LOGIN_MESSAGE.BAD_LOGIN,
      });
    }
  }
);
