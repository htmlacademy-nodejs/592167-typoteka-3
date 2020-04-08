'use strict';

const fs = require(`fs`);
const {deleteItemFromArray, getNewId} = require(`../../utils`);

const {MOCK_FILE_NAME} = require(`../../constants`);
let content = fs.existsSync(MOCK_FILE_NAME) ? JSON.parse(fs.readFileSync(MOCK_FILE_NAME)) : [];

const findAll = () => content;

const findById = (id) => content.find((el) => el.id === id);

const exists = (id) => findById(id) !== undefined;

const save = (newArticle, id) => {
  if (id) {
    const article = findById(id);
    const newContent = deleteItemFromArray(content, id);
    const tempArticle = Object.assign({}, article, newArticle);
    newContent.push(tempArticle);
    content = newContent;
  } else {
    newArticle.id = getNewId();
    content.push(newArticle);
  }
  return newArticle.id;
};

const remove = (id) => {
  content = deleteItemFromArray(content, id);
};

const findByTitle = (queryString) => {
  return content.filter((el) => el.title.toUpperCase()
    .includes(queryString.toUpperCase()));
};


module.exports = {
  findAll,
  findById,
  exists,
  save,
  remove,
  findByTitle,
};
