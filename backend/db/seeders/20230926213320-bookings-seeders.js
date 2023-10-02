'use strict';

/** @type {import('sequelize-cli').Migration} */
const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
    {"spotId": 1,
      "userId": 1,
      "startDate": "2024-11-24",
  "endDate": "2024-12-25"
    },
    {"userId": 2,
      "spotId": 2,
      "startDate": "2024-12-24",
  "endDate": "2024-12-28"
    },
  ],  { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or] :[
        { userId: 1, spotId: 1 },
        { userId: 2, spotId: 2 },
      ],
    }, {});
  }
};
