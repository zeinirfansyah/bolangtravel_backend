'use strict';

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rundowns = [];
    const numberOfRundowns = 60;
    
    for (let i = 0; i < numberOfRundowns; i++) {
      rundowns.push({
        title: faker.helpers.arrayElement(["Day 1", "Day 2", "Day 3"]),
        agenda: faker.lorem.paragraphs(1),
        travel_package_id: faker.number.int({ min: 1, max: 20 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("Rundowns", rundowns, {});
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
