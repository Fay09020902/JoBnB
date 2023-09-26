'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        "ownerId": 1,
        "address": "bbb123 Disney Lane",
      "city": "Santa Clara",
      "state": "California",
      "country": "United States of America",
      "lat": 37.7645354,
      "lng": -122.4730327,
      "name": "Kathy",
      "description": "Place where she lives",
      "price": 200
    },
      {"ownerId": 1,
      "address": "bbb Lily Lane",
    "city": "Santa Clara",
    "state": "California",
    "country": "United States of America",
    "lat": 30.7645354,
    "lng": -110.4730327,
    "name": "Matthew",
    "description": "Place where he lives",
    "price": 310},
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      ownerId: 1
    }, {});
  }
};
