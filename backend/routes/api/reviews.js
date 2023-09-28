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

//Add an Image to a Review based on the Review's id
router.post("/:reviewId/images",
            requireAuth,
            async (req, res, next) => {
                let { url} = req.body;
                const reviewId = Number(req.params.reviewId);
                const { user } = req;
                const currReview = await Review.findByPk(reviewId);
                if (!currReview) {
                    const err = new Error("Review couldn't be found");
                    err.status = 404;
                    return next(err);
                }
                //Only the owner of the review is authorized to add an image
                if (currReview.userId !== user.id) {
                    const err = new Error("Forbidden");
                    err.status = 403;
                    return next(err);
                }
                //Cannot add any more images because there is a maximum of 10 images per resource
                const numReviewImage = await ReviewImage.count({where: {reviewId}})
                if(numReviewImage > 10){
                    const err = new Error("Maximum number of images for this resource was reached");
                    err.status = 403;
                    return next(err);
                }
                const newReviewImage = await currReview.createReviewImage({url});

                return res.json({
                    id: newReviewImage.id,
                    url: newReviewImage.url,
                });
             });
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
