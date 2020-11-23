'use strict';

const fs = require(`fs`).promises;

const {getLogger} = require(`../backend/logger`);
const logger = getLogger();

const {getRandomInt, shuffle} = require(`../utils`);

const {initDb} = require(`../backend/db/db-connect`);

const FILE_ANNOUNCEMENTS_PATH = `./data/announcement.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;
const FILE_TITLES_PATH = `./data/titles.txt`;

const DEFAULT_COUNT = 1;

const UserRoles = {
  MIN: 1,
  MAX: 3,
};

const ArticlesToCategories = {
  MIN: 1,
  MAX: 5,
};

const Images = {
  MIN: 0,
  MAX: 2,
};

const ImagesName = [`forest`, `sea`, `skyscraper`];

const Comments = {
  MIN: 0,
  MAX: 5,
};

const readFile = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    logger.error(err.massage);
    return [];
  }
};

const getArticles = (countArticles, announcements, titles) => {
  const articles = [];
  for (let i = 0; i < countArticles; i++) {
    const title = titles[getRandomInt(0, titles.length - 2)];
    const announce = announcements[getRandomInt(0, announcements.length - 2)];
    const userId = getRandomInt(UserRoles.MIN, UserRoles.MAX);
    const article = {
      title,
      announce,
      description: `${title} ${announce}`,
      userId,
    };

    articles.push(article);
  }

  return articles;
};

const getArticlesToCategories = (countArticles) => {
  const articlesToCategories = [];
  const categoriesKey = [1, 2, 3, 4, 5];
  for (let i = 1; i <= countArticles; i++) {
    const articleToCategory = shuffle(categoriesKey).slice(0, getRandomInt(ArticlesToCategories.MIN, ArticlesToCategories.MAX));
    articlesToCategories.push(articleToCategory);
  }

  return articlesToCategories;
};

const getImages = (countArticles) => {
  const images = [];
  for (let i = 1; i <= countArticles; i++) {
    const imageCount = getRandomInt(Images.MIN, Images.MAX);
    for (let j = 1; j <= imageCount; j++) {
      const image = {
        articleId: i,
        image: `${ImagesName[getRandomInt(Images.MIN, Images.MAX)]}.jpg`,
      };
      images.push(image);
    }
  }

  return images;
};

const getComments = (countArticles, commentsList) => {
  const comments = [];
  for (let i = 1; i <= countArticles; i++) {
    const commentsCount = getRandomInt(Comments.MIN, Comments.MAX);
    for (let j = 0; j < commentsCount; j++) {
      const comment = {
        articleId: i,
        userId: getRandomInt(UserRoles.MIN, UserRoles.MAX),
        comment: commentsList[getRandomInt(0, commentsList.length - 2)],
      };
      comments.push(comment);
    }
  }

  return comments;
};

module.exports = {
  name: `--filldb`,
  async run(args) {
    const announcements = await readFile(FILE_ANNOUNCEMENTS_PATH);
    const commentsList = await readFile(FILE_COMMENTS_PATH);
    const titles = await readFile(FILE_TITLES_PATH);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;

    const dbData = {
      roles: [
        {role: `Автор`},
        {role: `Читатель`},
        {role: `Гость`},
      ],
      users: [
        {
          firstName: `Иванов`,
          lastName: `Иван`,
          email: `ivanov@mail.ru`,
          password: `1234`,
          roleId: 1
        },
        {
          firstName: `Сидоров`,
          lastName: `Виктор`,
          email: `sidorov@mail.ru`,
          password: `1234`,
          roleId: 2
        },
        {
          firstName: `Фролов`,
          lastName: `Егор`,
          email: `frolov@mail.ru`,
          password: `1234`,
          roleId: 3
        },
      ],
      categories: [
        {category: `Железо`},
        {category: `Дорога`},
        {category: `Публицистика`},
        {category: `Кино`},
        {category: `Деревья`},
      ],
      articles: getArticles(countArticles, announcements, titles),
      articlesToCategories: getArticlesToCategories(countArticles),
      images: getImages(countArticles),
      comments: getComments(countArticles, commentsList),
      countArticles,
    };

    initDb(dbData);
  }
};
