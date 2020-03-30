'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];


const getContent = () => {
  return content;
};

const add = (newArticle) => {
  newArticle.id = getNewId();
  content.push(newArticle);

  return newArticle.id;
};

const getContentById = (id) => {
  return content.find((el) => el.id === id);
};

const change = (newArticle, id) => {
  let newArticleList = deleteItemFromArray(content, id);
  if (newArticleList !== -1) {
    const mutableItem = content.find((el) => el.id === id);
    const modifiedItem = Object.assign({}, mutableItem, newArticle);
    newArticleList.push(modifiedItem);
    content = newArticleList;
  }

  return content;
};

const remove = (id) => {
  const answer = {};
  const newContent = deleteItemFromArray(content, id);
  if (newContent !== -1) {
    content = newContent;
    answer.status = 204;
    answer.text = ``;
  } else {
    answer.status = 410;
    answer.text = `Возможно заявление уже было удалено.`;
  }
  return answer;
};

const search = (queryString) => {
  return content.filter((el) => el.title.toUpperCase().match(queryString.query.toUpperCase()));
};

const changeContent = (newContent) => {
  content = newContent;
};

module.exports = {
  add,
  change,
  remove,
  search,
  getContent,
  getContentById,
  changeContent,
};
