"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bookings extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Bookings.belongsTo(models.Users, {
        as: "users",
        foreignKey: "user_id",
      });

      Bookings.belongsTo(models.Travel_Packages, {
        as: "travel_packages",
        foreignKey: "travel_package_id",
      });
    }
  }
  Bookings.init(
    {
      date: DataTypes.DATE,
      bank_name: DataTypes.STRING,
      payer_name: DataTypes.STRING,
      transfer_receipt: DataTypes.STRING,
      status: {
        type: DataTypes.ENUM("unpaid", "pending", "paid", "failed"),
        defaultValue: "unpaid",
      },
      user_id: DataTypes.INTEGER,
      travel_package_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Bookings",
      freezeTableName: true,
    }
  );
  return Bookings;
};
