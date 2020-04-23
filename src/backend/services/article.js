'use strict';

const articleRepository = require(`../repositories/article`);
const {ArticleNotFoundError} = require(`../errors/errors`);


const findAll = () => articleRepository.findAll();

const findById = (id) => {
  if (!articleRepository.exists(id)) {
    throw new ArticleNotFoundError(id);
  }

  return articleRepository.findById(id);
};

const create = (newArticle) => articleRepository.save(newArticle);

const update = (newArticle, id) => {
  if (!articleRepository.exists(id)) {
    throw new ArticleNotFoundError(id);
  }

  return articleRepository.save(newArticle, id);
};

const remove = (id) => {
  if (!articleRepository.exists(id)) {
    throw new ArticleNotFoundError(id);
  }

  articleRepository.remove(id);
};

const search = (queryString) => articleRepository.findByTitle(queryString);


module.exports = {
  create,
  update,
  remove,
  search,
  findAll,
  findById,
};
