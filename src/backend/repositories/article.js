'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {db, sequelize, Operator} = require(`../db/db-connect`);

const {MOCK_FILE_NAME, DEFAULT, COMMENTS_COUNT_FOR_MAIN_PAGE} = require(`../../constants`);
// const COMMENTS_COUNT_FOR_MAIN_PAGE = 4;
// const LIMIT_MOST_DISCUSSED_ANNOUNCEMENTS = 4;
// const LIMIT_ANNOUNCEMENTS_FOR_MAIN_PAGE = 8;
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
  limit: COMMENTS_COUNT_FOR_MAIN_PAGE,
});

// const getMostDiscussed = async () => {
//   const sql = `select a.id, a.announce, count(c.comment) as comments
//                from "Articles" a
//                       inner join "Comments" C
//                                  on a.id = C."articleId"
//                group by a.id, a.announce
//                order by comments desc
//                limit ${LIMIT_MOST_DISCUSSED_ANNOUNCEMENTS};`;
//
//   const type = sequelize.QueryTypes.SELECT;
//
//   return await sequelize.query(sql, {type});
// };

const getMostDiscussed = async () => await db.Article.findAll({
  attributes: [`id`, `announce`, [sequelize.fn(`count`, sequelize.col(`comments.id`)), `count`]],
  include: [{
    model: db.Comment,
    as: `comments`,
    attributes: [],
    required: false,
  }],
  group: [`Article.id`],
  order: [[`count`, `desc`]],
});

// const getPreviewsForMainPage = async (queryParams) => {
//   const sql = `select a.id,
//                       a.title,
//                       a.announce,
//                       a."createdAt",
//                       (select image from "Images" im where im."articleId" = a.id limit 1),
//                       (select count(*) as comments from "Comments" cm where cm."articleId" = a.id),
//                       string_agg(c.category, ', ') as categories
//                from "Articles" a
//                       inner join "ArticlesToCategories" atc
//                                  on a.id = atc."articleId"
//                       inner join "Categories" c
//                                  on atc."categoryId" = c.id
//                group by a.id, a.title, a.description, a."createdAt"
//                order by a."createdAt" desc
//                offset :selectionOffset limit :selectionCount;`;
//   const {start, count, offer} = queryParams;
//   const type = sequelize.QueryTypes.SELECT;
//
//   let selectionOffset = Number.parseInt(start, 10) || DEFAULT.OFFSET;
//   selectionOffset = selectionOffset === DEFAULT.OFFSET ? selectionOffset : (selectionOffset - 1) * DEFAULT.PREVIEWS_COUNT;
//   const selectionCount = Number.parseInt(count, 10) || DEFAULT.LIMIT;
//   const order = `a."createdAt" ${offer ? offer : DEFAULT.ORDER}`;
//   const replacements = {selectionOffset, selectionCount, order};
//   return await sequelize.query(sql, {type, replacements});
// };

const getPreviewsForMainPage = async (queryParams) => {
  const {start, count, offer} = queryParams;
  let selectionOffset = Number.parseInt(start, 10) || DEFAULT.OFFSET;
  selectionOffset = selectionOffset === DEFAULT.OFFSET ? selectionOffset : (selectionOffset - 1) * DEFAULT.PREVIEWS_COUNT;
  const selectionCount = Number.parseInt(count, 10) || DEFAULT.LIMIT;
  const order = `${offer ? offer : DEFAULT.ORDER}`;
  return await db.Article.findAll({
    attributes: [`id`, `title`, `announce`, `createdAt`],
    include: [
      {
        model: db.Category,
        as: `categories`,
        attributes: [`category`],
      },
      {
        model: db.Image,
        as: `images`,
        attributes: [`image`],
        limit: 1,
      }],
    order: [
      [`createdAt`, `${order}`]
    ],
    offset: selectionOffset,
    limit: selectionCount,
  });
};

const getCountAllArticles = async () => await db.Article.findAll({
  attributes: [
    [sequelize.fn(`count`, sequelize.col(`id`)), `articlesCount`],
  ],
});

const getCommentsForArticle = async () => await db.Comment.findAll({
  attributes: [`articleId`,
    [sequelize.fn(`count`, sequelize.col(`articleId`)), `count`],
  ],
  group: `articleId`,
  order: [`articleId`],
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

const testSelect = async () => await db.Article.findAll({
  attributes: [`id`, `announce`, [sequelize.fn(`count`, sequelize.col(`comments.id`)), `count`]],
  include: [{
    model: db.Comment,
    as: `comments`,
    attributes: [],
    required: false,
  }],
  group: [`Article.id`],
  order: [[`count`, `desc`]],
});


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
  getCountAllArticles,
  testSelect,
  getCommentsForArticle,
};
