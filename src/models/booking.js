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
    }
  }
  Booking.init({
    date: DataTypes.DATE,
    checkout: {
      type: Sequelize.ENUM('value', 'false'),
      defaultValue: 'false'
    },
    bank_name: DataTypes.STRING,
    payer_name: DataTypes.STRING,
    transfer_receipt: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};