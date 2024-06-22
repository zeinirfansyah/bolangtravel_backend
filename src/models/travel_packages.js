'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Travel_Packages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Travel_Packages.hasMany(models.Booking, {
        as: 'bookings',
        foreignKey: 'travel_package_id',
      });
      
      Travel_Packages.hasMany(models.Rundowns, {
        as: 'rundowns',
        foreignKey: 'travel_package_id',
      });

      Travel_Packages.belongsToMany(models.Destinations, {
        through: 'Travel_Packages_Destinations',
        as: 'destinations', 
        foreignKey: 'travel_package_id',
      });
    }
  }
  Travel_Packages.init({
    thumbnail: DataTypes.STRING,
    category: DataTypes.STRING,
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    price: DataTypes.INTEGER,
    location: DataTypes.STRING,
    duration: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Travel_Packages',
    freezeTableName: true
  });
  return Travel_Packages;
};