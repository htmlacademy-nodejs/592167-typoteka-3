'use strict';

const nanoid = require(`nanoid`);
const {deleteItemFromArray} = require(`../../utils`);

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
const addComment = (articleList, newCommentText, id) => {
  const newArticleList = deleteItemFromArray(articleList, id);
  const mutableArticle = articleList.find((el) => el.id === id);

  const newComment = {
    id: nanoid(6),
    text: newCommentText.text,
  };
  mutableArticle.comments.push(newComment);
  newArticleList.push(mutableArticle);

  return newArticleList;
};

module.exports = {
  deleteComment,
  addComment,
};
