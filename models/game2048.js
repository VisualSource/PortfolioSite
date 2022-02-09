'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game2048 extends Model {}
  
  Game2048.init({
    user: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
      unique: true
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Game2048',
  });
  return Game2048;
};