'use strict';

const articleService = require(`./article`);
const content = articleService.getContent();

const getCategories = () => {
  let categories = [];
  content.map((el) => (categories = categories.concat(el.category)));
  const tempSet = new Set(categories);
  return [...tempSet];
};

module.exports = {
  getCategories,
};
