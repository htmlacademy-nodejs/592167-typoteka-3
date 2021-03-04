'use strict';

const userRepository = require(`../repositories/users`);
const bcrypt = require(`bcrypt`);

const add = async (user) => {
  const allUsers = await userRepository.getAllUsers();
  user.roleId = allUsers.length > 0 ? 2 : 1;
  console.log(user);
  return await userRepository.add(user);
};

const checkUser = async (email) => {
  const isRegister = await userRepository.checkUser(email);
  if (isRegister) {
    return {userRegister: true};
  }
  return {userRegister: false};
};

const checkUserPassword = async (email, password) => {
  const user = await userRepository.getUserPassword(email);
  return await bcrypt.compare(password, user.dataValues.password);
};

module.exports = {
  add,
  checkUser,
  checkUserPassword,
};
