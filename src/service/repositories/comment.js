'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);
const articleRepository = require(`./article`);

const exists = (commentId) => {
  const found = articleRepository.findAll()
    .flatMap((article) => article.comments)
    .find((comment) => comment.id === commentId);
  return found !== undefined;
};

const findByArticleId = (articleId) => articleRepository.findById(articleId).comments;

const save = (newCommentText, articleId) => {
  const article = articleRepository.findById(articleId);
  const newComment = {
    id: getNewId(),
    text: newCommentText
  };
  article.comments.push(newComment);

  return newComment.id;
};

const remove = (articleId, commentId) => {
  const article = articleRepository.findById(articleId);
  const comments = article.comments;
  article.comments = deleteItemFromArray(comments, commentId);
};


module.exports = {
  exists,
  findByArticleId,
  save,
  remove,
};
