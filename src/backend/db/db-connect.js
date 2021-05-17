'use strict';

const Sequelize = require(`sequelize`);
const Operator = Sequelize.Op;
require(`dotenv`).config();
const fs = require(`fs`);

const {getLogger} = require(`../logger`);
const logger = getLogger();

const sequelize = new Sequelize(`${process.env.DB_NAME}`, `${process.env.DB_USER}`, `${process.env.USER_PASSWORD}`, {
  host: `${process.env.DB_HOST}`,
  dialect: `${process.env.DIALECT}`
});

const User = require(`./models/user`)(sequelize, Sequelize);
const Category = require(`./models/category`)(sequelize, Sequelize);
const Image = require(`./models/image`)(sequelize, Sequelize);
const Comment = require(`./models/comment`)(sequelize, Sequelize);
const UserRole = require(`./models/user_role`)(sequelize, Sequelize);
const Article = require(`./models/article`)(sequelize, Sequelize);

User.belongsTo(UserRole, {
  foreignKey: `roleId`,
  as: `userRoles`,
});

Article.belongsTo(User, {
  foreignKey: `userId`,
  as: `users`,
});

Comment.belongsTo(User, {
  foreignKey: `userId`,
  as: `users`,
});

User.hasMany(Comment, {
  foreignKey: `userId`,
  as: `comments`,
});

Article.hasMany(Comment, {
  foreignKey: `articleId`,
  as: `comments`,
});

Comment.belongsTo(Article, {
  foreignKey: `articleId`,
  as: `comments`,
});

Article.hasMany(Image, {
  foreignKey: `articleId`,
  as: `images`,
});

Article.belongsToMany(Category, {
  through: `ArticlesToCategories`,
  as: `categories`,
  foreignKey: `articleId`,
  timestamps: true,
  paranoid: true,
});

Category.belongsToMany(Article, {
  through: `ArticlesToCategories`,
  as: `articles`,
  foreignKey: `categoryId`,
});

const initDb = async (dbData, emptyTables) => {
  await sequelize.sync({force: true});
  console.info(`Структура БД успешно создана`);

  await UserRole.bulkCreate(dbData.roles);
  if (!emptyTables) {
    await User.bulkCreate(dbData.users);
    await Category.bulkCreate(dbData.categories);
    await Article.bulkCreate(dbData.articles);
    await Image.bulkCreate(dbData.images);
    await Comment.bulkCreate(dbData.comments);


    for (let i = 0; i < dbData.countArticles; i++) {
      const categories = await Category.findAll({
        where: {
          id: {
            [Sequelize.Op.in]: dbData.articlesToCategories[i]
          }
        },
      });

      const article = await Article.findByPk(i + 1);
      await article.addCategories(categories);
    }
  } else {
    if (!fs.existsSync(`${__dirname}/../logs`)) {
      fs.mkdirSync(`${__dirname}/../logs`);
    }
  }
};

const connectDb = async () => {
  try {
    logger.info(`Establishing a connection to the server.`);
    await sequelize.authenticate();
    logger.info(`The connection to the server has been established.`);
  } catch (err) {
    console.error(`Failed to establish connection for the reason: ${err}`);
    logger.error(`Failed to establish connection for the reason: ${err}`);
    process.exit();
  }
};


module.exports = {
  db: {
    User,
    Category,
    Image,
    Comment,
    UserRole,
    Article,
  },
  connectDb,
  initDb,
  sequelize,
  Sequelize,
  Operator,
};
