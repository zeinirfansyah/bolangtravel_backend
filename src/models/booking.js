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

      Booking.belongsTo(models.User, {
        foreignKey: 'booking_id',
      });

      Booking.belongsTo(models.Travel_Packages, {
        foreignKey: 'booking_id',
      });

    }
  }
  Booking.init({
    date: DataTypes.DATE,
    checkout: {
      type: Sequelize.ENUM('true', 'false'),
      defaultValue: 'false'
    },
    bank_name: DataTypes.STRING,
    payer_name: DataTypes.STRING,
    transfer_receipt: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('belum_bayar', 'pending', 'bayar_berhasil'),
      defaultValue: 'belum_bayar'
    },
>>>>>>> 2def747e099a39594db156474f509beb3c336237
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};