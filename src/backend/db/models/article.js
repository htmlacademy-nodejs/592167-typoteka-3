'use strict';

module.exports = (sequelize, DataTypes) => {
  class Article extends sequelize.Sequelize.Model { }
  Article.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    announce: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(250),
      allowNull: false,
    },
    description: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(1000),
      allowNull: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Article;
};
