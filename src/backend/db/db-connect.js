'use strict';

const Sequelize = require(`sequelize`);
require(`dotenv`).config();

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.USER_PASSWORD}`, {
  host: `${process.env.DB_HOST}`,
  dialect: `${process.env.DIALECT}`
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
  } catch (err) {
    process.exit();
  }
};

module.exports = {
  testConnection,
};
