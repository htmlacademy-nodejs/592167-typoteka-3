'use strict';

const categoriesRepository = require(`../repositories/categories`);

const getCategories = async () => await categoriesRepository.findAll();

module.exports = {
  getCategories,
};
