const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Review, Spot, ReviewImage } = require('../../db/models');
const e = require('express');

const router = express.Router();

const validateReviews = [
    check('review')
      .exists({ checkFalsy: true })
      .withMessage('Review text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({
        min: 1,
        max: 5,
      })
      .withMessage('Stars must be an integer from 1 to 5'),
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
