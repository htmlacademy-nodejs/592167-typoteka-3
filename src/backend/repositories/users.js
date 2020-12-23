'use strict';

const {db} = require(`../db/db-connect`);

const add = async (user) => db.User.create(user);

const checkUser = async (email) => db.User.findOne({
  where: {
    email,
  },
});

module.exports = {
  add,
  checkUser,
};
