'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(
        models.User,
          { foreignKey: 'ownerId',
          as: 'Owner'  }
      );

      Spot.hasMany(
        models.Review,
          { foreignKey: 'spotId', onDelete: 'CASCADE',  hooks: true }
      );

      Spot.hasMany(
        models.Booking,
          { foreignKey: 'spotId', onDelete: 'CASCADE',  hooks: true }
      );
      Spot.hasMany(
        models.SpotImage,
          { foreignKey: 'spotId', onDelete: 'CASCADE',  hooks: true }
      );
    }
  }
  Spot.init({
    ownerId: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lat: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        isNumeric: true,
      },
    },
    lng: {
      allowNull: false,
      type: DataTypes.FLOAT,
      validate: {
        isNumeric: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        //len: [1, 50], // Validation to ensure name length is between 1 and 50 characters
        notEmpty: true, //cannot be empty string
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL,
      allowNull: false,
    },
    avgRating: {
      type: DataTypes.FLOAT,
    }
  }, {
    sequelize,
    modelName: 'Spot',
  });
  return Spot;
};
