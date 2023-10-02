'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
    {"userId": 1,
      "spotId": 1,
      "review": "This was a good review!",
      "stars": 5
    },
    {"userId": 2,
      "spotId": 2,
      "review": "This was a bad review!",
      "stars": 1
    },
  ],  { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or] :[
        { userId: 1, spotId: 1 },
        { userId: 2, spotId: 2 },
      ],
    }, {});
  }
};
