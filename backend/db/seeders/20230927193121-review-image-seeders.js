'use strict';

/** @type {import('sequelize-cli').Migration} */
const { ReviewImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await ReviewImage.bulkCreate([
      {
        "reviewId": 1,
        "url": "image1.url",
      },
      {
        "reviewId": 2,
        "url": "image2.url",
      }
    ],  { validate: true })
    },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or] :[{reviewId: 1},
                {reviewId: 2}
              ]
    }, {});
  }
};