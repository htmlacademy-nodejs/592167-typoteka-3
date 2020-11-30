'use strict';

const {deleteItemFromArray} = require(`../../utils`);
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
// {
//   const article = articleRepository.findById(articleId);
//   const newComment = {
//     id: getNewId(),
//     text: newCommentText
//   };
//   article.comments.push(newComment);
//
//   return newComment.id;
// };

const remove = (articleId, commentId) => {
  const article = articleRepository.findById(articleId);
  const comments = article.comments;
  article.comments = deleteItemFromArray(comments, commentId);
};

const getCommentsByUser = async (userId) => db.Comment.findAll({
  attributes: [`comment`, `createdAt`],
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


module.exports = {
  exists,
  findByArticleId,
  save,
  remove,
  getCommentsByUser,
};
