'use strict';

module.exports = (sequelize, DataTypes) => {
  class Announcement extends sequelize.Sequelize.Model{ }
  Announcement.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    sum: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    typeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
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

  return Announcement;
};
