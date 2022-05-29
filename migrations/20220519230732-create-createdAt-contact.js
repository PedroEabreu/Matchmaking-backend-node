'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('contact', 'createdAt', { allowNull: false, type: Sequelize.DATE, defaultValue: new Date() }, {}),    
    await queryInterface.addColumn('contact', 'updatedAt', { allowNull: false, type: Sequelize.DATE, defaultValue: new Date() }, {})


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('contact', 'createdAt', {});
    await queryInterface.removeColumn('contact', 'updatedAt', {});
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
