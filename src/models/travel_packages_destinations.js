'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class travel_packages_destinations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  travel_packages_destinations.init({
    id_travel_packages: DataTypes.INTEGER,
    id_destinations: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'travel_packages_destinations',
  });
  return travel_packages_destinations;
};