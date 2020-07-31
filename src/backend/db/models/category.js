'use strict';

module.exports = (sequelize, DataTypes) => {
  class Category extends sequelize.Sequelize.Model{ }
  Category.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return Category;
};
