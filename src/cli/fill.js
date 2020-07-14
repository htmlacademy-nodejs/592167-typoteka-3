'use strict';

const fs = require(`fs`).promises;
const {getLogger} = require(`../backend/logger`);
const logger = getLogger();

const {getRandomInt, shuffle} = require(`../utils`);

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_ANNOUNCEMENT_PATH = `./data/announcement.txt`;

const DEFAULT_COUNT = 1;
const FILE_NAME_FILL_DATABASE = `fill-db.sql`;

const Announce = {
  MIN: 1,
  MAX: 5,
};

const Categories = {
  MIN: 1,
  MAX: 5,
};

const addCategories = (countArticles) => {
  let categories = `\n\n-- Добавляет связи между объявлениями и категориями
insert into articles_to_categories values `;
  for (let i = 1; i <= countArticles; i++) {
    const countCategories = getRandomInt(Categories.MIN, Categories.MAX);
    for (let j = 1; j <= countCategories; j++) {
      categories += `(${i}, ${j})`;
      categories += `${(i === countArticles && j === countCategories) ? `;` : `,`}\n`;
    }
  }

  return categories;
};

const addImages = (countArticles) => {
  let images = `\n-- Добавляет картинки
insert into images values `;
  for (let i = 1; i <= countArticles; i++) {
    images += `(default, ${i}, 'image${i}')`;
    images += `${i === countArticles ? `;` : `,`}\n`;
  }

  return images;
};

const addComments = (countArticles) => {
  let comments = `\n-- Добавляет комментарии
insert into comments values `;
  for (let i = 1; i <= countArticles; i++) {
    comments += `(default, ${i}, 2, 'comment text${i}')`;
    comments += `${i === countArticles ? `;` : `,`}\n`;
  }

  return comments;
};

const getRandomDate = () => {
  const day = new Date();
  const threeMonth = 90;
  day.setDate(day.getDate() - getRandomInt(0, threeMonth));
  return day;
};

const writeDataToFile = async (fileName, content) => {
  try {
    await fs.writeFile(fileName, content);
    return logger.info(`Operation success. File created.`);
  } catch (err) {
    return logger.error(`Can't write data to file ${err.message()}`);
  }
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return content.split(`\n`);
  } catch (err) {
    logger.error(err.message());
    return [];
  }
};

const generateArticles = (countArticles, titles, announcement) => {
  let articleList = ``;

  articleList += `-- Добавляет роли пользователей
insert into user_roles values (default, 'Автор'),
                         (default, 'Читатель'),
                         (default, 'Гость');

-- Добавляет пользователей
insert into users values (default, 'Иванов', 'Иван', 'my@mail.ru', '123455', 1),
                         (default, 'Петров', 'Петр', 'petrov@gmail.com', '34523', 2),
                         (default, 'Сидоров', 'Илья', 'sidorov.iliya@yahoo.com', 'I8e#8d', 3);

-- Добавляет категории
insert into categories values (default, 'Железо'),
                              (default, 'Дорога'),
                              (default, 'Публицистика'),
                              (default, 'Кино'),
                              (default, 'Деревья');

-- Добавляет объявления`;

  for (let i = 0; i < countArticles; i++) {
    if (articleList.length > 0) {
      articleList += `\n`;
    }
    const title = titles[getRandomInt(0, titles.length - 2)];
    const createDate = getRandomDate().toLocaleString();
    const description = shuffle(announcement).slice(0, getRandomInt(Announce.MIN, Announce.MAX)).join(` `);
    articleList += `insert into articles values (
      default,
      '${createDate}',
      '${title}',
      '${description}',
      1);`;
  }

  articleList += addCategories(countArticles);
  articleList += addImages(countArticles);
  articleList += addComments(countArticles);


  return articleList;
};


module.exports = {
  name: `--fill`,
  async run(args) {
    const titles = await readContent(FILE_TITLES_PATH);
    const announcement = await readContent(FILE_ANNOUNCEMENT_PATH);

    const [count] = args;
    const countArticles = Number.parseInt(count, 10) || DEFAULT_COUNT;
    const content = generateArticles(countArticles, titles, announcement);
    await writeDataToFile(FILE_NAME_FILL_DATABASE, content);
  }
};
