'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);
const articleService = require(`./article`);
const errors = require(`../errors/errors`);


const getContent = (id) => {
  const article = articleService.getContent().find((el) => el.id === id);
  return article.comments;
};

const remove = (id, commentId) => {
  const localContent = articleService.getContent();
  const newArticleList = deleteItemFromArray(localContent, id);
  if (newArticleList !== -1) {
    const mutableArticle = localContent.find((el) => el.id === id);

    const comments = mutableArticle.comments;
    const newComments = {
      comments: deleteItemFromArray(comments, commentId),
    };
    if (newComments.comments === -1) {
      articleService.changeContent(localContent);
      throw new errors.CommentNotFoundError(id, commentId);
    }
    const modifiedArticle = Object.assign({}, mutableArticle, newComments);
    newArticleList.push(modifiedArticle);
    articleService.changeContent(newArticleList);
  }
};

const add = (newCommentText, id) => {
  const localContent = articleService.getContent();
  const newComment = {};
  const newArticleList = deleteItemFromArray(localContent, id);
  if (newArticleList !== -1) {
    const mutableArticle = localContent.find((el) => el.id === id);

    newComment.id = getNewId();
    newComment.text = newCommentText.text;

    mutableArticle.comments.push(newComment);
    newArticleList.push(mutableArticle);
    articleService.changeContent(newArticleList);
  }

  return newComment.id;
};


module.exports = {
  remove,
  add,
  getContent,
};
