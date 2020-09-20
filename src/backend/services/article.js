'use strict';

const articleRepository = require(`../repositories/article`);
const categoryServices = require(`../services/categories`);
const {ArticleNotFoundError} = require(`../errors/errors`);


const findAll = async () => await articleRepository.findAll();

const getLastComments = async () => await articleRepository.getLastComments();

const getMostDiscussed = async () => {
  const res = await articleRepository.getMostDiscussed();
  return res.slice(0, 4);
};

const getPreviewsForMainPage = async (queryParams) => {
  const response = await articleRepository.getPreviewsForMainPage(queryParams);
  const comments = await articleRepository.getCommentsForArticle();
  const articleInfo = Array(response.length).fill({}).map((it, i) => {
    const el = {
      id: response[i].id,
      title: response[i].title,
      announce: response[i].announce,
      createdAt: response[i].createdAt,
      image: response[i].images[0].image,
    };
    const categories = response[i].categories.map((cat) => cat.category);
    el.categories = categories.join(`, `);
    const isArticleId = comments.find((com) => com.articleId === i + 1);
    el.countComment = isArticleId ? isArticleId.dataValues.count : 0;
    return el;
  });
  return articleInfo;
};

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
  return true;
};

const search = async (queryString) => await articleRepository.findByTitle(queryString);

const getCountAllArticles = async () => {
  const resCount = await articleRepository.getCountAllArticles();
  return resCount[0].dataValues.articlesCount;
};

const getAllElementsForMainPage = async (queryParams) => {
  const categories = await categoryServices.getCategories();
  const mostDiscussed = await getMostDiscussed();
  const previews = await getPreviewsForMainPage(queryParams);
  const lastComments = await getLastComments();
  const pagination = await getCountAllArticles();

  const allElementsForMainPage = {
    categories,
    mostDiscussed,
    previews,
    lastComments,
    pagination,
  };

  return allElementsForMainPage;
};

const testSelect = async () => {
  const response = await categoryServices.getCategories();
  return response;
};

const testCategory = async () => await categoryServices.getCategories();


module.exports = {
  create,
  update,
  remove,
  search,
  findAll,
  findById,
  getLastComments,
  getMostDiscussed,
  getPreviewsForMainPage,
  getCountAllArticles,
  getAllElementsForMainPage,
  testSelect,
  testCategory,
};
