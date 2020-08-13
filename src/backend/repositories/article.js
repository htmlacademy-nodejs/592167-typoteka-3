'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {db, sequelize} = require(`../db/db-connect`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let articles = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];


const findAll = async () => {
  const sql = `select a.id,
                      a.title,
                      a.announce,
                      a."createdAt",
                      (select image from "Images" im where im."articleId" = a.id limit 1),
                      (select count(*) as comments from "Comments" cm where cm."articleId" = a.id),
                      string_agg(c.category, ', ') as categories
               from "Articles" a
                      inner join "ArticlesToCategories" atc
                                 on a.id = atc."articleId"
                      inner join "Categories" c
                                 on atc."categoryId" = c.id
               group by a.id, a.title, a.description, a."createdAt"
               order by a."createdAt" desc limit 1;`;

  const type = sequelize.QueryTypes.SELECT;

  return await sequelize.query(sql, {type});
};

const getMostDiscussedComments = async () => await db.Comment.findAll({
  attributes: [`comment`],
  as: `comments`,
  order: [[`createdAt`, `DESC`]],
  limit: 3,
});

const findById = (id) => articles.find((el) => el.id === id);

const exists = (id) => findById(id) !== undefined;

const save = (newArticle, id) => {
  if (id) {
    const article = findById(id);
    const newContent = deleteItemFromArray(articles, id);
    const tempArticle = Object.assign({}, article, newArticle);
    newContent.push(tempArticle);
    articles = newContent;
  } else {
    newArticle.id = getNewId();
    articles.push(newArticle);
  }
  return newArticle.id;
};

const remove = (id) => {
  articles = deleteItemFromArray(articles, id);
};

const findByTitle = (queryString) => {
  return articles.filter((el) => el.title.toUpperCase()
    .includes(queryString.toUpperCase()));
};


module.exports = {
  findAll,
  findById,
  exists,
  save,
  remove,
  findByTitle,
  getMostDiscussedComments,
};
