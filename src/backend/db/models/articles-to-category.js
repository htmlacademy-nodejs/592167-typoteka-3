'use strict';

module.exports = (sequelize, DataTypes) => {
  class ArticlesToCategory extends sequelize.Sequelize.Model{ }
  ArticlesToCategory.init({
    articleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
    tableName: `Articles_To_Category`,
  });

  return ArticlesToCategory;
};
