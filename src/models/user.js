"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Booking, {
        as: 'bookings',
        foreignKey: 'user_id',
      })
    }
  }
  Users.init(
    {
      fullname: DataTypes.STRING,
      username: DataTypes.STRING,
      phone: DataTypes.STRING,
      address: DataTypes.TEXT,
      role: {
        type: DataTypes.ENUM("admin", "customer"),
        defaultValue: "customer",
      },
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
      freezeTableName: true
    }
  );
  return Users;
};
