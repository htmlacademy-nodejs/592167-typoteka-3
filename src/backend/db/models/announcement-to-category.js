'use strict';

module.exports = (sequelize, DataTypes) => {
  class AnnouncementToCategory extends sequelize.Sequelize.Model{ }
  AnnouncementToCategory.init({
    announcementId: {
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
  });

  return AnnouncementToCategory;
};
