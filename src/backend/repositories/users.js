'use strict';

const {db} = require(`../db/db-connect`);

const add = async (user) => db.User.create(user);

const checkUser = async (email) => db.User.findOne({
  where: {
    email,
  },
});

const getUserPassword = async (email) => db.User.findOne({
  attributes: [`password`],
  where: {
    email,
  },
});

module.exports = {
  add,
  checkUser,
  getUserPassword,
};
