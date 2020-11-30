'use strict';

const categoriesRepository = require(`../repositories/categories`);

const getCategories = async (queryString) => {
  if (queryString === `only`) {
    return await categoriesRepository.categoriesOnly();
  } else {
    return await categoriesRepository.findAll();
  }
};

const create = (data) => {
  return categoriesRepository.create(data);
};

const edit = async (data, categoryId, extension) => {
  if (extension === `delete`) {
    return categoriesRepository.remove(categoryId);
  }
  return categoriesRepository.edit(data, categoryId);
};

module.exports = {
  getCategories,
  create,
  edit,
};
