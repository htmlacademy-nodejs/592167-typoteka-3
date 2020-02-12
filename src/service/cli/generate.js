'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_TITLES_PATH = `./data/titles.txt`;
const FILE_CATEGORIES_PATH = `./data/categories.txt`;
const FILE_ANNOUNCEMENT_PATH = `./data/announcement.txt`;

const FILE_NAME = `mock.json`;
const DEFAULT_OFFER = 1;
const MAX_OFFER = 1000;

const Annonce = {
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

const generateOffers = (count, titles, announcement, categories) => (
  Array(count).fill({}).map(() => ({
    title: titles[getRandomInt(0, titles.length - 1)],
    createDate: getRandomDate().toLocaleString(),
    annonce: shuffle(announcement).slice(0, getRandomInt(Annonce.MIN, Annonce.MAX)).join(` `),
    fullText: shuffle(announcement).slice(0, getRandomInt(FullText.MIN, FullText.MAX)).join(` `),
    category: shuffle(categories).slice(0, getRandomInt(Category.MIN, Category.MAX)),
  }))
);

const generateMocks = async (arg) => {
  const titles = await readContent(FILE_TITLES_PATH);
  const announcment = await readContent(FILE_ANNOUNCEMENT_PATH);
  const catigories = await readContent(FILE_CATEGORIES_PATH);

  const [count] = arg;
  const countOffer = Number.parseInt(count, 10) || DEFAULT_OFFER;
  if (countOffer > MAX_OFFER) {
    console.error(chalk.red(`Не больше 1000 публикаций`));
    process.exit(ExitCode.error);
  }
  const content = JSON.stringify(generateOffers(countOffer, titles, announcment, catigories));
  await writeToFile(FILE_NAME, content);
};

module.exports = {
  name: `--generate`,
  async run(arg) {
    generateMocks(arg);
  }
};
