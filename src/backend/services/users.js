'use strict';

const userRepository = require(`../repositories/users`);
const bcrypt = require(`bcrypt`);

const {USER_ROLE_ADMIN, USER_ROLE_USER} = require(`../../constants`);

const add = async (user) => {
  const allUsers = await userRepository.getAllUsers();
  user.roleId = allUsers.length > 0 ? USER_ROLE_USER : USER_ROLE_ADMIN;
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

const getUserInfo = async (email) => await userRepository.getUserInfo(email);

const checkAdmin = async (email) => {
  const userInfo = await userRepository.getUserInfo(email);
  return userInfo.dataValues.roleId === USER_ROLE_ADMIN ? {isAdmin: true} : {isAdmin: false};
};

module.exports = {
  add,
  checkUser,
  checkUserPassword,
  getUserInfo,
  checkAdmin,
};
