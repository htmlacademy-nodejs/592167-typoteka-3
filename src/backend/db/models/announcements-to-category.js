'use strict';

module.exports = (sequelize, DataTypes) => {
  class AnnouncementsToCategory extends sequelize.Sequelize.Model{ }
  AnnouncementsToCategory.init({
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

  return AnnouncementsToCategory;
};
