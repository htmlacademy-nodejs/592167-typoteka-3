'use strict';

const nanoid = require(`nanoid`);

const deleteItemFromArray = (array, id) => {
  const idx = array.map((el) => el.id).indexOf(id);
  if (idx === -1) {
    return idx;
  }

  const beforeIdx = array.slice(0, idx);
  const afterIdx = array.slice(idx + 1);

  return [...beforeIdx, ...afterIdx];
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [someArray[randomPosition], someArray[i]];
  }

  return someArray;
};
const getNewId = () => {
  return nanoid(6);
};

const addNewArticle = (articleList, newArticle) => {
  newArticle.id = getNewId();
  articleList.push(newArticle);

  return articleList;
};
const changeArticle = (articleList, newArticle, id) => {
  let newArticleList = deleteItemFromArray(articleList, id);
  if (newArticleList !== -1) {
    const mutableItem = articleList.find((el) => el.id === id);
    const modifiedItem = Object.assign({}, mutableItem, newArticle);
    newArticleList.push(modifiedItem);
  }

  return newArticleList;
};
const deleteArticle = (articleList, id) => {
  return deleteItemFromArray(articleList, id);
};
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

const searchArticles = (articleList, search) => {
  return articleList.filter((el) => el.title.toUpperCase().match(search.query.toUpperCase()));
};

module.exports = {
  getRandomInt,
  shuffle,
  getNewId,
  addNewArticle,
  changeArticle,
  deleteArticle,
  deleteComment,
  addComment,
  searchArticles,
};
