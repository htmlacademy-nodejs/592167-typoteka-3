'use strict';

const Sequelize = require(`sequelize`);
require(`dotenv`).config();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const {roles, users, categories, articles,
  articlesToCategories, images, comments} = require(`./mocks`);

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.USER_PASSWORD}`, {
  host: `${process.env.DB_HOST}`,
  dialect: `${process.env.DIALECT}`
});

const User = require(`./models/user`)(sequelize, Sequelize);
const Category = require(`./models/category`)(sequelize, Sequelize);
const Image = require(`./models/image`)(sequelize, Sequelize);
const Comment = require(`./models/comment`)(sequelize, Sequelize);
const ArticlesToCategory = require(`./models/articles-to-category`)(sequelize, Sequelize);
const UserRole = require(`./models/user_role`)(sequelize, Sequelize);
const Article = require(`./models/article`)(sequelize, Sequelize);

const initDb = async () => {
  await sequelize.sync({force: true});
  console.info(`Структура БД успешно создана`);

  await UserRole.bulkCreate(roles);
  await User.bulkCreate(users);
  await Category.bulkCreate(categories);
  await Article.bulkCreate(articles);
  await ArticlesToCategory.bulkCreate(articlesToCategories);
  await Image.bulkCreate(images);
  await Comment.bulkCreate(comments);
};

const testConnection = async () => {
  try {
    logger.info(`Establishing a connection to the server.`);
    await initDb();
    // await sequelize.authenticate();
    logger.info(`The connection to the server has been established.`);
  } catch (err) {
    console.error(`Failed to establish connection for the reason: ${err}`);
    logger.error(`Failed to establish connection for the reason: ${err}`);
    process.exit();
  }
};

module.exports = {
  testConnection,
};
