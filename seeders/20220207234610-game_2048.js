'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Game2048s', [
      {
        user: 'auth0|5db8da93b3065c0c6c4d752c', 
        score: 1185, 
        username: 'VisualSource', 
        date: '2021-12-13'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Game2048s', null, {});
  }
};
