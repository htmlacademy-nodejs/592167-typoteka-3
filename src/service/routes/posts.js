'use strict';

const fs = require(`fs`).promises;
const {Router} = require(`express`);
const chalk = require(`chalk`);
const router = new Router();

const {MOCK_FILE_NAME} = require(`../../constants`);

router.get(`/`, async (req, res) => {
  try {
    const content = await fs.readFile(MOCK_FILE_NAME);
    res.json(JSON.parse(content));
  } catch (err) {
    console.log(chalk.red(err));
    res.send([]);
  }
});

module.exports = router;
