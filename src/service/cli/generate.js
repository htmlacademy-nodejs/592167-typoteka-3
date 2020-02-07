'use strict';

const fs = require(`fs`).promises;
const chalk = require(`chalk`);

const {getRandomInt, shuffle} = require(`../../utils`);
const {ExitCode} = require(`../../constants`);

const FILE_NAME = `mock.json`;
const DEFAULT_OFFER = 1;
const MAX_OFFER = 1000;

const Annonce = {
  MIN: 1,
  MAX: 5,
};

const FullText = {
  MIN: 1,
  MAX: ANNOUNCEMENT_AND_FULL_TEXT.length - 1,
};

const Category = {
  MIN: 1,
  MAX: CATEGORIES.length - 1,
};

const writeToFile = async (fileName, content) => {
  try {
    await fs.writeFile(fileName, content);
    return console.info(chalk.green(`Operation success. File created.`));
  } catch (err) {
    return console.error(chalk.red(`Can't write data to file...`, err));
  }
};

const getRandomDate = () => {
  const day = new Date();
  const threeMonth = 90;
  day.setDate(day.getDate() - getRandomInt(0, threeMonth));
  return day;
};

const generateOffers = (count) => (
  Array(count).fill({}).map(() => ({
    title: TITLES[getRandomInt(0, TITLES.length - 1)],
    createDate: getRandomDate().toLocaleString(),
    annonce: shuffle(ANNOUNCEMENT_AND_FULL_TEXT).slice(0, getRandomInt(Annonce.MIN, Annonce.MAX)).join(` `),
    fullText: shuffle(ANNOUNCEMENT_AND_FULL_TEXT).slice(0, getRandomInt(FullText.MIN, FullText.MAX)).join(` `),
    category: shuffle(CATEGORIES).slice(0, getRandomInt(Category.MIN, Category.MAX)),
  }))
);

const generateMocks = async (arg) => {
  const [count] = arg;
  const countOffer = Number.parseInt(count, 10) || DEFAULT_OFFER;
  if (countOffer > MAX_OFFER) {
    console.error(chalk.red(`Не больше 1000 публикаций`));
    process.exit(ExitCode.error);
  }
  const content = JSON.stringify(generateOffers(countOffer));
  await writeToFile(FILE_NAME, content);
};

module.exports = {
  name: `--generate`,
  async run(arg) {
    generateMocks(arg);
  }
};
