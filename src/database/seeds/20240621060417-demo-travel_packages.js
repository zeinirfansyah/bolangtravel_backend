"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const travel_packages = [];
    const numberOfTravelPackages = 20;

    for (let i = 0; i < numberOfTravelPackages; i++) {
      travel_packages.push({
        thumbnail: faker.image.urlPicsumPhotos(640, 480, true),
        category: faker.helpers.arrayElement(["family", "solo", "honeymoon"]),
        title: faker.music.songName(),
        description: faker.commerce.productDescription(),
        price: faker.commerce.price(),
        location: faker.location.city(),
        duration: faker.number.int({ min: 1, max: 7 }),
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert("Travel_Packages", travel_packages, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Travel_Packages", null, {});
  },
};
