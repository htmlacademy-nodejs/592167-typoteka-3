'use strict';

const articleRepository = require(`../repositories/article`);
const {ArticleNotFoundError} = require(`../errors/errors`);


const findAll = () => articleRepository.findAll();

const findById = (id) => articleRepository.findById(id);

const create = (newArticle) => articleRepository.save(newArticle, undefined);

const update = (newArticle, id) => {
  if (!articleRepository.exists(id)) {
    throw new ArticleNotFoundError(id);
  }

  articleRepository.save(newArticle, id);
};

const remove = (id) => {
  if (!articleRepository.exists(id)) {
    throw new ArticleNotFoundError(id);
  }

  articleRepository.remove(id);
};

const search = (queryString) => articleRepository.findByTitle(queryString.query);


module.exports = {
  create,
  update,
  remove,
  search,
  findAll,
  findById,
};
