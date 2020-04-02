'use strict';

class CommentNotFoundError extends Error {}

class ArticleNotFoundError extends Error {}

module.exports = {
  CommentNotFoundError,
  ArticleNotFoundError,
};
