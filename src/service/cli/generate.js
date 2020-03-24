'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle, getNewId} = require(`../../utils`);
const {ExitCode, MOCK_FILE_NAME} = require(`../../constants`);

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_ANNOUNCEMENT_PATH = `./data/announcement.txt`;
const FILE_COMMENTS_PATH = `./data/comments.txt`;


const DEFAULT_OFFER = 1;
const MAX_OFFER = 1000;

const Announce = {
  MIN: 1,
  MAX: 5,
};

const FullText = {
  MIN: 1,
  MAX: 8,
};

const Category = {
  MIN: 1,
  MAX: 5,
};

const Comment = {
  MIN: 0,
  MAX: 8,
};

const writeToFile = async (fileName, content) => {
  try {
    await fs.writeFile(fileName, content);
    return console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    return console.error(chalk.red(`Can't write data to file...`, err));
  }
};

const readContent = async (filePath) => {
  try {
    const content = await fs.readFile(filePath, `utf8`);
    return content.split(`\n`);
  } catch (err) {
    console.error(chalk.red(err));
    return [];
  }
};

const getRandomDate = () => {
  const day = new Date();
  const threeMonth = 90;
  day.setDate(day.getDate() - getRandomInt(0, threeMonth));
  return day;
};

const getComments = (countComments, comments) => {
  return Array(countComments).fill({}).map(() => ({
    id: getNewId(),
    text: shuffle(comments).slice(0, getRandomInt(Comment.MIN, Comment.MAX)).join(` `),
  }));
};

const generateOffers = (count, titles, announcement, categories, comments) => (
  Array(count).fill({}).map(() => ({
    id: getNewId(),
    title: titles[getRandomInt(0, titles.length - 1)],
    createDate: getRandomDate().toLocaleString(),
    announce: shuffle(announcement).slice(0, getRandomInt(Announce.MIN, Announce.MAX)).join(` `),
    fullText: shuffle(announcement).slice(0, getRandomInt(FullText.MIN, FullText.MAX)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(Category.MIN, Category.MAX)),
    comments: getComments(getRandomInt(Comment.MIN, Comment.MAX), comments),
  }))
);

const generateMocks = async (arg) => {
  const titles = await readContent(FILE_TITLES_PATH);
  const announcement = await readContent(FILE_ANNOUNCEMENT_PATH);
  const categories = await readContent(FILE_CATEGORIES_PATH);
  const comments = await readContent(FILE_COMMENTS_PATH);

  const [count] = arg;
  const countOffer = Number.parseInt(count, 10) || DEFAULT_OFFER;
  if (countOffer > MAX_OFFER) {
    console.error(chalk.red(`Не больше 1000 публикаций`));
    process.exit(ExitCode.error);
  }
  const content = JSON.stringify(generateOffers(countOffer, titles, announcement, categories, comments));
  await writeToFile(MOCK_FILE_NAME, content);
};

module.exports = {
  name: `--generate`,
  async run(arg) {
    generateMocks(arg);
  }
};
