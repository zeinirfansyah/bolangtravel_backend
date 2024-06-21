"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Travel_Packages", [
      {
        thumbnail:
          "https://images.unsplash.com/photo-1560089168-651f2246893a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
        category: "Family",
        title: "Blue Origin Fams",
        description:
          "Blue Origin Fams is a travel package for families who want to enjoy their vacation in Indonesia. The package is designed to provide them with a unique and exciting experience. The package includes everything you need to have a blast!",
        price: 26000000,
        location: "Bali",
        duration: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Travel_Packages", null, {});
  },
};
