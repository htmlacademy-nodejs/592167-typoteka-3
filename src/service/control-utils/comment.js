'use strict';

const {deleteItemFromArray, getNewId} = require(`../../utils`);

const deleteComment = (articleList, id, commentId) => {
  const newArticleList = deleteItemFromArray(articleList, id);
  const mutableArticle = articleList.find((el) => el.id === id);

  const comments = mutableArticle.comments;
  const newComments = {
    comments: deleteItemFromArray(comments, commentId),
  };
  const modifiedArticle = Object.assign({}, mutableArticle, newComments);
  newArticleList.push(modifiedArticle);

  return newArticleList;
};
const add = (articleList, newCommentText, id) => {
  const newArticleList = deleteItemFromArray(articleList, id);
  const mutableArticle = articleList.find((el) => el.id === id);

  const newComment = {
    id: getNewId(),
    text: newCommentText.text,
  };
  mutableArticle.comments.push(newComment);
  newArticleList.push(mutableArticle);

  return newArticleList;
};

module.exports = {
  deleteComment,
  add,
};
