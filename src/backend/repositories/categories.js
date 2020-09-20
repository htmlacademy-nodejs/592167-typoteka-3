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

// const findAll = async () => {
//   const sql = `select C.category, count(a.id) as countArticles
//                from "Articles" a
//                       inner join "ArticlesToCategories" ATC
//                                  on a.id = ATC."articleId"
//                       inner join "Categories" C
//                                  on C.id = ATC."categoryId"
//                group by c.category;`;
//   const type = sequelize.QueryTypes.SELECT;
//   return await sequelize.query(sql, {type});
// };


// const sql = `select C.category, count(a.id) as countArticles
//              from "Articles" a
//                     inner join "ArticlesToCategories" ATC
//                                on a.id = ATC."articleId"
//                     inner join "Categories" C
//                                on C.id = ATC."categoryId"
//              group by c.category;`;
// const type = sequelize.QueryTypes.SELECT;
// return await sequelize.query(sql, {type});


module.exports = {
  findAll,
};
