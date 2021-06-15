'use strict';

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model { }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lastName: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      // eslint-disable-next-line new-cap
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return User;
};
