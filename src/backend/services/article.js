'use strict';

const articleRepository = require(`../repositories/article`);
const categoryServices = require(`../services/categories`);
const {ArticleNotFoundError} = require(`../errors/errors`);
const {COMMENTS_COUNT_FOR_MAIN_PAGE} = require(`../../constants`);


const createDateForPreview = (date) => {
  const createDate = new Date(date);
  const tempMonth = `${createDate.getMonth()}`.padStart(2, `00`);
  return `${createDate.getDate()}.${tempMonth}.${createDate.getFullYear()}, ${createDate.getUTCHours()}:${createDate.getMinutes()}`;
};

const findAll = async () => await articleRepository.findAll();

const getLastComments = async () => await articleRepository.getLastComments();

const getMostDiscussed = async () => {
  const res = await articleRepository.getMostDiscussed();
  return res.slice(0, COMMENTS_COUNT_FOR_MAIN_PAGE);
};

const getPreviewsForMainPage = async (queryParams) => {
  const response = await articleRepository.getPreviewsForMainPage(queryParams);
  const comments = await articleRepository.getCommentsForArticle();
  return Array(response.length).fill({}).map((it, i) => {
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

  return {
    categories,
    mostDiscussed,
    previews,
    lastComments,
    pagination,
  };
};

const testSelect = async (categoryId) => {
  return await articleRepository.testSelect(categoryId);
};

const testCategory = async () => await categoryServices.getCategories();

const getArticlesForCategory = async (categoryId) => {
  console.log(categoryId);
  let categoriesList = await categoryServices.getCategories();
  categoriesList = categoriesList.map((cat) => {
    return {
      id: cat.id,
      category: cat.category,
      count: cat.dataValues.count,
      active: cat.id === Number.parseInt(categoryId, 10),
    };
  });
  const resArticleIdList = await articleRepository.getArticleIdListByCategoryId(categoryId);
  const articleIdList = resArticleIdList.map((el) => el.id);
  const resArticles = await articleRepository.getArticlesForCategory(articleIdList);
  const articles = Array(resArticles.length).fill({}).map((el, i) => {
    const dataCreate = new Date(resArticles[i].createdAt);
    return {
      id: resArticles[i].id,
      title: resArticles[i].title,
      announce: resArticles[i].announce,
      categories: resArticles[i].categories.map((it) => it.category),
      image: resArticles[i].image,
      createdAt: createDateForPreview(dataCreate),
    };
  });

  const categoryActive = categoriesList.find((catList) => catList.active === true).category;
  return {categoriesList, articles, categoryActive};
  // return articles;
};


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
  getArticlesForCategory,
};
