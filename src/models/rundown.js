'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rundowns extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Rundowns.belongsTo(models.Travel_Packages, {
        as: 'travel_packages',
        foreignKey: 'travel_package_id',
      });
    }
  }
  Rundowns.init({
    title: DataTypes.STRING,
    agenda: DataTypes.STRING,
    travel_package_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Rundowns',
    freezeTableName: true
  });
  return Rundowns;
};