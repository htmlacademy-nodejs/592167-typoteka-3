'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {db, sequelize} = require(`../db/db-connect`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let articles = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const findAll = async () => await db.Article.findAll({
  attributes: [`id`, `title`, `announce`, `createdAt`,
    [
      sequelize.literal(`(
                    SELECT image.image
        FROM "Images" AS image
        WHERE
                image."articleId" = "Article".id
        limit 1
                )`),
      `images.image`
    ],
    [
      sequelize.literal(`(
                    SELECT count(comment.comment)
        FROM "Comments" as comment
        WHERE
                comment."articleId" = "Article".id
        )`),
      `comments.comment`
    ],
    [
      sequelize.literal(`string_agg(c.category, ', ')`), `categories`
    ],
  ],
  include: [
    {
      model: db.ArticlesToCategory,
      as: `articlesToCategories`,
      include: {
        model: db.Category,
        as: `articlesToCategories`,
      }
    },
  ],
  limit: 1,
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
};
