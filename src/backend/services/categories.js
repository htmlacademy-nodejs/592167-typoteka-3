'use strict';

const categoriesRepository = require(`../repositories/categories`);

const getCategories = async (queryString) => {
  if (queryString === `only`) {
    return await categoriesRepository.categoriesOnly();
  } else {
    return await categoriesRepository.findAll();
  }
};

module.exports = {
  getCategories,
};
