'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class rundown extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  rundown.init({
    title: DataTypes.STRING,
    agenda: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'rundown',
  });
  return rundown;
};