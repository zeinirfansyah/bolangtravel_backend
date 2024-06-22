'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('travel_packages_destinations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      travel_package_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Travel_Packages',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      destination_id: {
        type: Sequelize.INTEGER,
        reference: {
          model: 'Destinations',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('travel_packages_destinations');
  }
};