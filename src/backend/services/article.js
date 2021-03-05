'use strict';

const articleRepository = require(`../repositories/article`);
const categoryServices = require(`../services/categories`);
const userServices = require(`../services/users`);
const categoryRepository = require(`../repositories/categories`);
const {ArticleNotFoundError} = require(`../errors/errors`);
const {COMMENTS_COUNT_FOR_MAIN_PAGE, MOCK_USER_ID} = require(`../../constants`);

const checkArticle = require(`../validation-schemas/article-shema`);

const {getLogger} = require(`../logger`);
const logger = getLogger();


const createDateForPreview = (date) => {
  const createDate = new Date(date);
  const tempDay = `${createDate.getDate()}`.padStart(2, `00`);
  const tempMonth = `${createDate.getMonth() + 1}`.padStart(2, `00`);
  return `${tempDay}.${tempMonth}.${createDate.getFullYear()}, ${createDate.getUTCHours()}:${createDate.getMinutes()}`;
};

const findAll = async () => await articleRepository.findAll();

const getLastComments = async () => await articleRepository.getLastComments();

const getMostDiscussed = async () => {
  const resMostDiscussed = await articleRepository.getMostDiscussed();
  const mostDiscussed = resMostDiscussed.filter((it) => it.dataValues.count > 0);
  if (mostDiscussed <= COMMENTS_COUNT_FOR_MAIN_PAGE) {
    return mostDiscussed;
  }
  return mostDiscussed.slice(0, COMMENTS_COUNT_FOR_MAIN_PAGE);
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
      image: (response[i].images.length > 0 && response[i].images[0].image) ? response[i].images[0].image : ``,
    };
    el.categories = response[i].categories.map((cat) => {
      return {
        id: cat.id,
        category: cat.category,
      };
    });
    const isArticleId = comments.find((com) => com.articleId === el.id);
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

const create = async (data) => {
  const newArticle = {
    'title': data.title,
    'announce': data.announcement,
    'description': data[`full-text`],
    'userId': MOCK_USER_ID,
  };

  newArticle.categories = [];
  if (Array.isArray(data[`checkbox-category`])) {
    newArticle.categories = data[`checkbox-category`].map((el) => Number.parseInt(el, 10));
  } else {
    newArticle.categories.push(data[`checkbox-category`]);
  }

  const image = {
    image: data.image,
  };

  checkArticle.validateAsync(newArticle)
    .then(async (response) => {
      return await articleRepository.save(response, image);
    })
    .catch((err) => logger.error(err));
};

const edit = async (data, articleId) => {
  const newArticle = {
    'title': data.title,
    'announce': data.announcement,
    'description': data[`full-text`],
    'userId': MOCK_USER_ID,
  };

  newArticle.categories = [];
  if (Array.isArray(data[`checkbox-category`])) {
    newArticle.categories = data[`checkbox-category`].map((el) => Number.parseInt(el, 10));
  } else {
    newArticle.categories.push(data[`checkbox-category`]);
  }

  return await articleRepository.edit(newArticle, articleId);
};

const update = (newArticle, id) => {
  if (!articleRepository.exists(id)) {
    throw new ArticleNotFoundError(id);
  }

  return articleRepository.save(newArticle, id);
};


const remove = async (articleId) => await articleRepository.remove(articleId);

const search = async (queryParams) => {
  let userInfoForSearch = {};
  if (queryParams.username) {
    userInfoForSearch = await userServices.getUserInfo(queryParams.username);
  }
  const resArticle = await articleRepository.findByTitle(queryParams.query);
  const articlesList = Array(resArticle.length).fill({}).map((el, i) => {
    return {
      id: resArticle[i].id,
      title: resArticle[i].title,
      createdAt: createDateForPreview(resArticle[i].createdAt),
    };
  });
  return {articlesList, userInfoForSearch};
};

const getCountAllArticles = async () => {
  const resCount = await articleRepository.getCountAllArticles();
  return resCount[0].dataValues.articlesCount;
};

const getAllElementsForMainPage = async (queryParams) => {
  const resCategories = await categoryServices.getCategories();
  const categories = resCategories.filter((el) => el.dataValues.count > 0);
  const mostDiscussed = await getMostDiscussed();
  const previews = await getPreviewsForMainPage(queryParams);
  const lastComments = await getLastComments();
  const pagination = await getCountAllArticles();
  let userInfo = {};
  if (queryParams.username) {
    userInfo = await userServices.getUserInfo(queryParams.username);
  }

  return {
    categories,
    mostDiscussed,
    previews,
    lastComments,
    pagination,
    userInfo,
  };
};

const testSelect = async (categoryId) => {
  return await articleRepository.testSelect(categoryId);
};

const testCategory = async () => await categoryServices.getCategories();

const getArticlesForCategory = async (categoryId) => {
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
    const categories = resArticles[i].categories.map((it) => {
      return {
        id: it.id,
        category: it.category,
      };
    });
    return {
      id: resArticles[i].id,
      title: resArticles[i].title,
      announce: resArticles[i].announce,
      categories,
      image: (resArticles[i].images.length > 0 && resArticles[i].images[0].image) ? resArticles[i].images[0].image : ``,
      createdAt: createDateForPreview(dataCreate),
      comments: resArticles[i].comments.length,
    };
  });

  const categoryActive = categoriesList.find((catList) => catList.active === true).category;
  return {categoriesList, articles, categoryActive};
};

const getArticleById = async (id, queryParams) => {
  const tempArticle = await articleRepository.getArticleById(id);
  const firstLine = tempArticle.shift();
  const categoriesForArticle = firstLine.categories.map((el) => el.id);

  const article = {
    articleId: firstLine.id,
    title: firstLine.title,
    image: firstLine.images[0] ? firstLine.images[0].image : ``,
    createdAt: createDateForPreview(firstLine.createdAt),
    announce: firstLine.announce,
    description: firstLine.description,
    authorization: true,
  };

  if (queryParams.extension === `post-info`) {
    article.comments = firstLine.comments.map((el) => {
      return {
        comment: el.comment,
        createdAt: createDateForPreview(el.createdAt),
        user: `${el.users.firstName} ${el.users.lastName}`,
      };
    });
    article.categories = await categoryRepository.getCategoryById(categoriesForArticle);
  } else if (queryParams.extension === `edit`) {
    const resCategories = await categoryRepository.findAll();
    article.categories = resCategories.map((el) => {
      el.dataValues.isChecked = categoriesForArticle.includes(el.id);
      return el;
    });
  }
  let userInfoForArticleById = {};
  if (queryParams.username) {
    userInfoForArticleById = await userServices.getUserInfo(queryParams.username);
  }
  article.userInfoForArticleById = userInfoForArticleById;

  return article;
};

const getMyArticles = async (userId) => {
  const response = await articleRepository.getMyArticles(userId);
  const categories = await categoryServices.getCategories();
  const articles = Array(response.length).fill({}).map((el, i) => {
    return {
      id: response[i].id,
      title: response[i].title,
      createdAt: createDateForPreview(response[i].createdAt),
    };
  });
  return {articles, categories};
};


module.exports = {
  create,
  edit,
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
  getArticleById,
  getMyArticles,
};
