'use strict';

const userRepository = require(`../repositories/users`);

const add = async (user) => await userRepository.add(user);

const checkUser = async (email) => {
  const isRegister = await userRepository.checkUser(email);
  if (isRegister) {
    return {userRegister: true};
  }
  return {userRegister: false};
};

module.exports = {
  add,
  checkUser,
};
