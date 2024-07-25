"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Destinations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Destinations.belongsToMany(models.Travel_Packages, {
        through: "Travel_Packages_Destinations",
        as: "travel_packages",
        foreignKey: "destination_id",
      });
    }
  }
  Destinations.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      location: DataTypes.STRING,
      ticket_price: DataTypes.INTEGER,
      open_hour: DataTypes.STRING,
      destination_contact: DataTypes.STRING,
      is_available: {
        type: DataTypes.ENUM("true", "false"),
        defaultValue: "true",
      },
      expiry_date: DataTypes.DATE,
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Destinations",
      freezeTableName: true,
    }
  );
  return Destinations;
};
