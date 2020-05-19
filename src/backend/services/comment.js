'use strict';

const articleRepository = require(`../repositories/article`);
const commentRepository = require(`../repositories/comment`);
const {CommentNotFoundError, ArticleNotFoundError} = require(`../errors/errors`);


const getByArticleId = (articleId) => {
  if (!articleRepository.exists(articleId)) {
    throw new ArticleNotFoundError(articleId);
  }

  return commentRepository.findByArticleId(articleId);
};

const remove = (articleId, commentId) => {
  if (!commentRepository.exists(commentId)) {
    throw new CommentNotFoundError(articleId, commentId);
  }

  return commentRepository.remove(articleId, commentId);
};

const add = (newCommentText, articleId) => {
  if (!articleRepository.exists(articleId)) {
    throw new ArticleNotFoundError(articleId);
  }

  return commentRepository.save(newCommentText.text, articleId);
};


module.exports = {
  getByArticleId,
  remove,
  add,
};
