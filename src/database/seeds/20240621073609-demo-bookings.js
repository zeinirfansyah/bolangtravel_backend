'use strict';

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const bookings = [];
    const numberOfBookings = 60;
    
    for (let i = 0; i < numberOfBookings; i++) {
      bookings.push({
        date: faker.date.future(),
        status: "belum_bayar",
        user_id: faker.number.int({ min: 11, max: 60 }),
        travel_package_id: faker.number.int({ min: 1, max: 20 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("Bookings", bookings, {});
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
