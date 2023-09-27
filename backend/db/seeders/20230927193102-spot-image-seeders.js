'use strict';

/** @type {import('sequelize-cli').Migration} */

const { SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        "spotId": 1,
        "url": "image1.url",
        "preview": true
      },
      {
        "spotId": 2,
        "url": "image2.url",
        "preview": false
      }
    ],  { validate: true })
    },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      [Op.or] :[{spotId: 1},
                {spotId: 2}
              ]
    }, {});
  }
};
