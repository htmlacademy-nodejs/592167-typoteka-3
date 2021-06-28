'use strict';

module.exports = (sequelize, DataTypes) => {
  class Image extends sequelize.Sequelize.Model { }
  Image.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: true,
    },
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Image;
};
