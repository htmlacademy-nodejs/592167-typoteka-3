'use strict';

const nanoid = require(`nanoid`);
const {deleteItemFromArray} = require(`../../utils`);

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
const searchArticles = (articleList, search) => {
  return articleList.filter((el) => el.title.toUpperCase().match(search.query.toUpperCase()));
};

module.exports = {
  addNewArticle,
  changeArticle,
  deleteArticle,
  searchArticles,
};
