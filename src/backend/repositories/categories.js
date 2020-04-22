'use strict';

const articleRepository = require(`../repositories/article`);

const findAll = () => {
  const categories = articleRepository.findAll()
    .flatMap((article) => article.categories);
  const tempSet = new Set(categories);

  return [...tempSet];
};

module.exports = {
  findAll,
};
