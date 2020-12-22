'use strict';

const userRepository = require(`../repositories/users`);

const add = async (user) => await userRepository.add(user);

module.exports = {
  add,
};
