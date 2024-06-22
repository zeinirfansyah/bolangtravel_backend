"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Travel_Packages_Destinations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Travel_Packages_Destinations.belongsTo(models.Travel_Packages, {
        foreignKey: "travel_package_id",
        as: "travel_packages",
      });

      Travel_Packages_Destinations.belongsTo(models.Destinations, {
        foreignKey: "destination_id",
        as: "destinations",
      });
    }
  }
  Travel_Packages_Destinations.init(
    {
      travel_package_id: DataTypes.INTEGER,
      destination_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Travel_Packages_Destinations",
      freezeTableName: true
    }
  );
  return Travel_Packages_Destinations;
};
