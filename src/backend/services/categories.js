'use strict';

const categoriesRepository = require(`../repositories/categories`);
const articlesRepository = require(`../repositories/article`);

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

const edit = async (data, categoryId) => {
  return categoriesRepository.edit(data, categoryId);
};

const remove = async (categoryId) => {
  const articles = await articlesRepository.getArticleIdListByCategoryId(categoryId);
  if (articles.length > 0) {
    return {isDelete: false};
  } else {
    await categoriesRepository.remove(categoryId);
    return {isDelete: true};
  }
};

module.exports = {
  getCategories,
  create,
  edit,
  remove,
};
