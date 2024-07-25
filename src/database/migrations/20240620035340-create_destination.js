"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Destinations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      location: {
        type: Sequelize.STRING,
      },
      ticket_price: {
        type: Sequelize.INTEGER,
      },
      open_hour: {
        type: Sequelize.STRING,
      },
      destination_contact: {
        type: Sequelize.STRING,
      },
      is_available: {
        type: Sequelize.ENUM("true", "false"),
        defaultValue: "true",
      },
      expiry_date: {
        type: Sequelize.DATE,
      },
      thumbnail: {
        type: Sequelize.STRING,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Destinations");
  },
};
