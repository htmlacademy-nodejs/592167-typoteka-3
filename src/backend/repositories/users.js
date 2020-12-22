'use strict';

const {db} = require(`../db/db-connect`);

const add = async (user) => db.User.create(user);

module.exports = {
  add,
};
