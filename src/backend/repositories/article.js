'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {db, sequelize} = require(`../db/db-connect`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let articles = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

// const findAll = async () => await db.Article.findAll({
//   attributes: [`id`, `title`, `announce`, `createdAt`,
//     [
//       sequelize.literal(`(
//                     SELECT image.image
//         FROM "Images" AS image
//         WHERE
//                 image."articleId" = "Article".id
//         limit 1
//                 )`),
//       `images.image`
//     ],
//     [
//       sequelize.literal(`(
//                     SELECT count(comment.comment)
//         FROM "Comments" as comment
//         WHERE
//                 comment."articleId" = "Article".id
//         )`),
//       `comments.comment`
//     ],
//   ],
//   include: {
//     model: db.Category,
//     attributes: [sequelize.literal("STRING_AGG(category, '-')")],
//     as: `categories`,
//   },
//   group: [`Article.id`, `Article.title`, `Article.announce`, `Article.createdAt`,],
//   limit: 1,
// });

const findAll = async () => {
  const sql = `select a.id, a.title, a.announce, a."createdAt",
       (select count(*) from "Comments" cm where cm."articleId"=a.id),
       string_agg(c.category, ', ') as categories
from "Articles" a
         inner join "ArticlesToCategories" atc
                    on a.id = atc."articleId"
         inner join "Categories" c
                    on atc."categoryId" = c.id
group by a.id, a.title, a.description, a."createdAt"
order by a."createdAt" desc;`;

  const type = sequelize.QueryTypes.SELECT;
  const articles = await sequelize.query(sql, {type});

  sequelize.close();
  return articles;
}

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
