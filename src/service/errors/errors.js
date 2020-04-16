'use strict';

class CommentNotFoundError extends Error {
  constructor(articleId, commentId) {
    super();
    this.message = `Comment with id ${commentId} isn't found for article with id ${articleId}`;
  }
}

class ArticleNotFoundError extends Error {
  constructor(articleId) {
    super();
    this.message = `Article with id ${articleId} isn't found`;
  }
}

module.exports = {
  CommentNotFoundError,
  ArticleNotFoundError,
};
