'use strict';

const {db, sequelize} = require(`../db/db-connect`);

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


module.exports = {
  findAll,
};
