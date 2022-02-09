'use strict';

module.exports = {
  /**
   * 
   * @param {import("sequelize").QueryInterface} queryInterface 
   * @param {import("sequelize").Sequelize} Sequelize 
   */
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('mcs_resources',{ 
      id: {
        type: Sequelize.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.DataTypes.TEXT
      },
      description: {
        type: Sequelize.DataTypes.TEXT,
        defaultValue: ""
      },
      icon: {
        allowNull: true,
        type: Sequelize.DataTypes.TEXT
      },
      state: {
        type: Sequelize.DataTypes.ENUM("active","admited","removed","rejected"),
        allowNull: false,
        defaultValue: "admited"
      },
      images: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: "[]",
        allowNull: false
      },
      links: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: "[]",
        allowNull: false
      },
      required: {
        type: Sequelize.DataTypes.JSON,
        defaultValue: "[]",
        allowNull: false
      },
      type: {
        type: Sequelize.DataTypes.ENUM("datapack","plugin","resourcepack","mod"),
        defaultValue: "datapack",
        allowNull: false
      },
      added: {
        type: Sequelize.DataTypes.DATEONLY,
        defaultValue: Sequelize.DataTypes.NOW
      }
    });
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('mcs_resources');
  }
};
