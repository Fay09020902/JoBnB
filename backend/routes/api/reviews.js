const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, ReviewImage } = require('../../db/models');
const e = require('express');

const router = express.Router();

const validateReviews = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .withMessage('First Name is required'),
    check('lastName')
      .exists({ checkFalsy: true })
      .withMessage('Last Name is required'),
    handleValidationErrors
  ];

  //Get all Reviews owned by the Current User
  router.get(
      "/sessions",
      requireAuth,
      async (req, res, next) => {
          const {user} = req
          const reviews = await Review.findAll(
              {
                  where: {userId: user.id},
                  include:  {
                      model: User,
                      attributes: ["id", "firstName", "lastName"],
                    },
                  include:  {
                    model: Spot,
                    //attributes: ["id", "firstName", "lastName"],
                    },
                  include:  {
                    model: ReviewImage,
                    //attributes: ["id", "firstName", "lastName"],
                    },
              }
          )

        //   let previewImage;
        //   const updatedSpots = spots.map(spot => {
        //       //console.log(spot.toJSON())
        //       const {SpotImages, ...rest} = spot.toJSON()
        //       SpotImages.forEach(spotimage => {
        //           if(spotimage.preview) {
        //               previewImage = spotimage.url
        //           }
        //           else {
        //               previewImage = null
        //           }
        //       })
        //       return {
        //           ...rest,
        //           previewImage
        //       }
        //    })

          return res.json({
            Reviews: reviews
            });
      });



module.exports = router;
