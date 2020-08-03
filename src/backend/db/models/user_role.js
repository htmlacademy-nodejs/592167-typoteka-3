'use strict';

module.exports = (sequelize, DataTypes) => {
  class UserRole extends sequelize.Sequelize.Model{ }
  UserRole.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return UserRole;
};
