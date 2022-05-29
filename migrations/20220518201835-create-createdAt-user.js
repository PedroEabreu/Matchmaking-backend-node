'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('usr', 'createdAt', { allowNull: false, type: Sequelize.DATE,  defaultValue: new Date() }, {}),    
    await queryInterface.addColumn('usr', 'updatedAt', { allowNull: false, type: Sequelize.DATE,  defaultValue: new Date()}, {})


  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('usr', 'createdAt', {});
    await queryInterface.removeColumn('usr', 'updatedAt', {});
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
