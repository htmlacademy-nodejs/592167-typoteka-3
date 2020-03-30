'use strict';


const {deleteItemFromArray, getNewId} = require(`../../utils`);


const add = (articleList, newArticle) => {
  newArticle.id = getNewId();
  articleList.push(newArticle);

  return articleList;
};

const change = (articleList, newArticle, id) => {
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

const search = (articleList, queryString) => {
  return articleList.filter((el) => el.title.toUpperCase().match(queryString.query.toUpperCase()));
};

module.exports = {
  add,
  change,
  deleteArticle,
  search,
};
