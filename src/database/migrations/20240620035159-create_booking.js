"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      date: {
        type: Sequelize.DATE,
      },
      bank_name: {
        type: Sequelize.STRING,
      },
      payer_name: {
        type: Sequelize.STRING,
      },
      transfer_receipt: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("unpaid", "pending", "paid", "failed"),
        defaultValue: "unpaid",
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
      },
      travel_package_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Travel_Packages",
          key: "id",
        },
        onUpdate: "cascade",
        onDelete: "cascade",
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
    await queryInterface.dropTable("Bookings");
  },
};
