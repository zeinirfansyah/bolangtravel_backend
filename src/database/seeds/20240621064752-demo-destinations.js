"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const destinations = [];
    const numberOfDestinations = 60;

    for (let i = 0; i < numberOfDestinations; i++) {
      destinations.push({
        title: faker.music.songName(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.urlPicsumPhotos(640, 480, true),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("Destinations", destinations, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Destinations", null, {});
  },
};
