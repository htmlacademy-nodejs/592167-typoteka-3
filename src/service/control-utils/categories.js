'use strict';

const categoriesRepository = require(`../repositories/categories`);

const getCategories = () => categoriesRepository.findAll();

module.exports = {
  getCategories,
};
