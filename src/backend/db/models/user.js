'use strict';

module.exports = (sequelize, DataTypes) => {
  class User extends sequelize.Sequelize.Model{ }
  User.init({
    id: {
      type: DataTypes.integer,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.string(50),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.string(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.string(100),
      allowNull: false,
    },
    password: {
      type: DataTypes.string,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.integer,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.text,
      allowNull: true,
    }
  }, {
    sequelize,
    timestamps: true,
    paranoid: true,
  });

  return User;
};
