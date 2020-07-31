'use strict';

const Sequelize = require(`sequelize`);
require(`dotenv`).config();

const {getLogger} = require(`../logger`);
const logger = getLogger();

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.USER_PASSWORD}`, {
  host: `${process.env.DB_HOST}`,
  dialect: `${process.env.DIALECT}`
});

const Type = require(`./models/type`)(sequelize, Sequelize);
const User = require(`./models/user`)(sequelize, Sequelize);
const Category = require(`./models/category`)(sequelize, Sequelize);
const Image = require(`./models/image`)(sequelize, Sequelize);
const Comment = require(`./models/comment`)(sequelize, Sequelize);
const AnnouncementsToCategory = require(`./models/announcements-to-category`)(sequelize, Sequelize);
const Announcement = require(`./models/announcement`)(sequelize, Sequelize);

const initDb = async () => {
  await sequelize.sync({force: true});
  console.info(`Структура БД успешно создана`);
};

const testConnection = async () => {
  try {
    logger.info(`Establishing a connection to the server.`);
    // await initDb();
    await sequelize.authenticate();
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
