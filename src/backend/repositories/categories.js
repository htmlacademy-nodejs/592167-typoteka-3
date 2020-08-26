'use strict';

const {sequelize} = require(`../db/db-connect`);
// const articleRepository = require(`../repositories/article`);

const findAll = () => {
  // const categories = articleRepository.findAll()
  //   .flatMap((article) => article.categories);
  // const tempSet = new Set(categories);
  //
  // return [...tempSet];
  const sql = `select C.category, count(a.id)
               from "Articles" a
                      inner join "ArticlesToCategories" ATC
                                 on a.id = ATC."articleId"
                      inner join "Categories" C
                                 on C.id = ATC."categoryId"
               group by c.category;`;
  const type = sequelize.QueryTypes.SELECT;
  return sequelize.query(sql, {type});
};

module.exports = {
  findAll,
};
