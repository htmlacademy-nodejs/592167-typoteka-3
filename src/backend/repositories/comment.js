'use strict';

const articleRepository = require(`./article`);
const {db} = require(`../db/db-connect`);

const exists = (commentId) => {
  const found = articleRepository.findAll()
    .flatMap((article) => article.comments)
    .find((comment) => comment.id === commentId);
  return found !== undefined;
};

const findByArticleId = (articleId) => articleRepository.findById(articleId).comments;

const save = (newComment) => db.Comment.create(newComment);

const remove = async (commentId) => db.Comment.destroy({
  where: {
    id: commentId,
  },
});

const getCommentsByUser = async (userId) => db.Comment.findAll({
  attributes: [`id`, `comment`, `createdAt`],
  include: [{
    model: db.Article,
    as: `comments`,
    attributes: [`id`, `title`],
  }, {
    model: db.User,
    as: `users`,
    attributes: [`firstName`, `lastName`],
  }],
  where: {
    userId,
  },
  order: [[`createdAt`, `desc`]],
});

const getCommentsForArticle = async (articleId) => db.Comment.findAll({
  attributes: [`id`, `comment`, `createdAt`],
  include: {
    model: db.User,
    as: `users`,
    attributes: [`firstName`, `lastName`, `avatar`],
  },
  where: {
    articleId,
  },
  order: [[`createdAt`, `desc`]],
});


module.exports = {
  exists,
  findByArticleId,
  save,
  remove,
  getCommentsByUser,
  getCommentsForArticle
};
