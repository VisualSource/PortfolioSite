'use strict';
const {
  Model
} = require('sequelize');
/**
 * 
 * @param {*} sequelize 
 * @param {import("sequelize").DataTypes} DataTypes 
 * @returns 
 */
module.exports = (sequelize, DataTypes) => {
  class MCSResources extends Model {}
  
  MCSResources.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    name: {
      type: DataTypes.TEXT
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: ""
    },
    icon: {
      allowNull: true,
      type: DataTypes.TEXT
    },
    state: {
      type: DataTypes.ENUM("active","admited","removed","rejected"),
      allowNull: false,
      defaultValue: "admited"
    },
    images: {
      type: DataTypes.JSON,
      defaultValue: "[]",
      allowNull: false
    },
    links: {
      type:  DataTypes.JSON,
      defaultValue: "[]",
      allowNull: false
    },
    required: {
      type: DataTypes.JSON,
      defaultValue: "[]",
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM("datapack","plugin","resourcepack","mod"),
      defaultValue: "datapack",
      allowNull: false
    },
    added: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    timestamps: false,
    modelName: 'mcs_resources',
  });
  
  return MCSResources;
};