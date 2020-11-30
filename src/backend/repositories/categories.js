'use strict';

const {db, sequelize, Operator} = require(`../db/db-connect`);

const findAll = async () => db.Category.findAll({
  attributes: [`id`, `category`, [sequelize.fn(`count`, sequelize.col(`articles.id`)), `count`]],
  include: [{
    model: db.Article,
    as: `articles`,
    attributes: [],
    through: {
      attributes: [],
    },
    required: false,
  }],
  group: [`Category.id`, `Category.category`],
});

const categoriesOnly = async () => db.Category.findAll({
  attributes: [`id`, `category`],
});

const getCategoryById = (categories) => db.Category.findAll({
  attributes: [`id`, `category`, [sequelize.fn(`count`, sequelize.col(`articles.id`)), `count`]],
  include: [{
    model: db.Article,
    as: `articles`,
    attributes: [],
    through: {
      attributes: [],
    },
    required: false,
  }],
  group: [`Category.id`, `Category.category`],
  where: {
    id: {
      [Operator.in]: categories,
    },
  },
});

const create = (data) => db.Category.create(data);

const edit = (data, categoryId) => db.Category.update(data, {
  where: {
    id: categoryId,
  },
});

module.exports = {
  findAll,
  categoriesOnly,
  getCategoryById,
  create,
  edit,
};
