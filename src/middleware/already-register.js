'use strict';

const axios = require(`axios`);

const {TEMPLATE, BACKEND_URL, REGISTRATION_MESSAGE} = require(`../constants`);

module.exports = () => (
  async (req, res, next) => {
    const resUserCheck = await axios.get(`${BACKEND_URL}/api/users/check?email=${req.user.email}`);
    const {userRegister} = resUserCheck.data;
    if (!userRegister) {
      next();
    } else {
      res.render(TEMPLATE.REGISTRATION, {
        errorMessages: [REGISTRATION_MESSAGE.USER_ALREADY_REGISTER]
      });
    }
  }
);
