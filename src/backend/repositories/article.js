'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {db, sequelize, Operator} = require(`../db/db-connect`);

const {MOCK_FILE_NAME} = require(`../../constants`);
const COMMENTS_COUNT_FOR_MAINPAGE = 3;
const LIMIT_MOST_DISCUSSED_ANNOUNCEMENTS = 4;
const LIMIT_ANNOUNCEMENTS_FOR_MAIN_PAGE = 8;
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
               order by a."createdAt" desc;`;

  const type = sequelize.QueryTypes.SELECT;

  return await sequelize.query(sql, {type});
};

const getLastComments = async () => await db.Comment.findAll({
  attributes: [`comment`],
  as: `comments`,
  order: [[`createdAt`, `DESC`]],
  limit: COMMENTS_COUNT_FOR_MAINPAGE,
});

const getMostDiscussed = async () => {
  const sql = `select a.id, a.announce, count(c.comment) as comments
               from "Articles" a
                      inner join "Comments" C
                                 on a.id = C."articleId"
               group by a.id, a.announce
               order by comments desc
               limit ${LIMIT_MOST_DISCUSSED_ANNOUNCEMENTS};`;

  const type = sequelize.QueryTypes.SELECT;

  return await sequelize.query(sql, {type});
};

const getPreviewsForMainPage = async () => {
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
               order by a."createdAt" desc
               limit ${LIMIT_ANNOUNCEMENTS_FOR_MAIN_PAGE};`;
  const type = sequelize.QueryTypes.SELECT;
  return await sequelize.query(sql, {type});
};

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

const findByTitle = async (queryString) => {
  return await db.Article.findAll({
    attributes: [`title`],
    where: {
      title: {
        [Operator.substring]: queryString,
      },
    },
  });
};


module.exports = {
  findAll,
  findById,
  exists,
  save,
  remove,
  findByTitle,
  getLastComments,
  getMostDiscussed,
  getPreviewsForMainPage,
};
