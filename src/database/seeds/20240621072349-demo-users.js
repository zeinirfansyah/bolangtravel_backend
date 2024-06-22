'use strict';

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const users = [];
    const numberOfUsers = 60;
    
    for (let i = 0; i < numberOfUsers; i++) {
      users.push({
        fullname: faker.person.fullName(),
        username: faker.internet.userName(),
        phone: faker.phone.number(),
        address: faker.location.streetAddress(),
        role: faker.helpers.arrayElement(["admin", "customer"]),
        email: faker.internet.email(),
        password: "password",
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("Users", users, {});
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
