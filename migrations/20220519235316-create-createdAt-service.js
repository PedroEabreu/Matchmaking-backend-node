'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('service', 'createdAt', { allowNull: false, type: Sequelize.DATE, defaultValue: new Date() }, {}),    
    await queryInterface.addColumn('service', 'updatedAt', { allowNull: false, type: Sequelize.DATE, defaultValue: new Date() }, {})

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
