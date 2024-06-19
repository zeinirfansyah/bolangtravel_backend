'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      bank_name: {
        type: Sequelize.STRING
      },
      payer_name: {
        type: Sequelize.STRING
      },
      transfer_receipt: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM('belum_bayar', 'pending', 'bayar_berhasil'),
        defaultValue: 'belum_bayar'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
  }
};