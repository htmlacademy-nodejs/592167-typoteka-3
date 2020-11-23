'use strict';

const fs = require(`fs`);
const {deleteItemFromArray} = require(`../../utils`);

const {db, sequelize, Operator} = require(`../db/db-connect`);

const {MOCK_FILE_NAME, DEFAULT, COMMENTS_COUNT_FOR_MAIN_PAGE} = require(`../../constants`);
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
  attributes: [`comment`, `articleId`],
  order: [[`createdAt`, `DESC`]],
  limit: COMMENTS_COUNT_FOR_MAIN_PAGE,
});

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
        attributes: [`id`, `category`],
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

const save = async (newArticle, image) => {
  const temp = await db.Article.create(newArticle);

  image.articleId = temp.id;
  await db.Image.create(image);

  newArticle.categories.forEach(async (el) => {
    const category = await db.Category.findByPk(el);
    await temp.addCategories(category);
  });

  return temp;
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

const getArticleIdListByCategoryId = async (categoryId) => {
  return await db.Article.findAll({
    attributes: [`id`],
    include: [
      {
        model: db.Category,
        as: `categories`,
        attributes: [],
        where: {
          id: categoryId
        }
      }],
  });
};

const getArticlesForCategory = async (categoryIdList) => {
  return await db.Article.findAll({
    attributes: [`id`, `title`, `announce`, `createdAt`],
    include: [
      {
        model: db.Category,
        as: `categories`,
        attributes: [`id`, `category`],
      },
      {
        model: db.Image,
        as: `images`,
        attributes: [`image`],
        limit: 1,
      },
      {
        model: db.Comment,
        as: `comments`,
        attributes: [`comment`],
      }],
    where: {
      id: {
        [Operator.in]: categoryIdList,
      }
    },
    order: [
      [`createdAt`, `DESC`]
    ],
  });
};

const getArticleById = async (id) => await db.Article.findAll({
  attributes: [`id`, `title`, `announce`, `createdAt`],
  include: [{
    model: db.Image,
    as: `images`,
    attributes: [`image`],
    limit: 1,
  }, {
    model: db.Comment,
    as: `comments`,
    attributes: [`comment`, `createdAt`],
    include: {
      model: db.User,
      as: `users`,
      attributes: [`firstName`, `lastName`],
    }
  }, {
    model: db.Category,
    as: `categories`,
    attributes: [`id`, `category`],
  }],
  where: {
    id
  },
});

const getMyArticles = async (userId) => await db.Article.findAll({
  attributes: [`id`, `title`, `createdAt`],
  where: {
    userId,
  }
});


const testSelect = async (categoryId) => {
  return await db.Article.findAll({
    attributes: [`id`],
    include: [
      {
        model: db.Category,
        as: `categories`,
        attributes: [],
        where: {
          id: categoryId
        }
      }],
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
  getCountAllArticles,
  testSelect,
  getCommentsForArticle,
  getArticlesForCategory,
  getArticleIdListByCategoryId,
  getArticleById,
  getMyArticles,
};
