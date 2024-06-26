'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Booking.belongsTo(models.Users, {
        as: 'users',
        foreignKey: 'user_id',
      });

      Booking.belongsTo(models.Travel_Packages, {
        as: 'travel_packages',
        foreignKey: 'travel_package_id',
      });

    }
  }
  Booking.init({
    date: DataTypes.DATE,
    bank_name: DataTypes.STRING,
    payer_name: DataTypes.STRING,
    transfer_receipt: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('belum_bayar', 'pending', 'bayar_berhasil'),
      defaultValue: 'belum_bayar'
    },
    user_id: DataTypes.INTEGER,
    travel_package_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Booking',
    freezeTableName: true
  });
  return Booking;
};