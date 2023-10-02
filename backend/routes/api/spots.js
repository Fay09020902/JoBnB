const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors, validateQuery } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage,ReviewImage, Review, Booking, sequelize } = require('../../db/models');
const e = require('express');

const router = express.Router();

const validateSignup = [
    check('address')
      .exists({ checkFalsy: true })
      .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .withMessage('City address is required'),
    check('state')
        .exists({ checkFalsy: true })
        .withMessage('State address is required'),
    check('lat')
        .optional()
        .isFloat({
            min: -90,
            max: 90,
          })
        .withMessage('Latitude is not valid'),
    check('lng')
        .optional()
        .isFloat({
            min: -180,
            max: 180,
          })
        .withMessage('Longitude is not valid'),
    check('name')
        .exists({ checkFalsy: true })
        .isLength({ min: 1, max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .isFloat({
            min: 0,
          })
        .withMessage('Price per day is required'),
    handleValidationErrors
];

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


  const validateBooking = [
    check("startDate")
      .exists({ checkFalsy: true })
      .isISO8601()
      .withMessage("Enter a valid start date"),
    check("endDate")
      .exists({ checkFalsy: true })
      .isISO8601()
      .withMessage("Enter a valid end date"),
    handleValidationErrors,
  ];

// //Get all Spots
// router.get(
//     "/",
//     async (req, res, next) => {
//         const spots = await Spot.findAll({
//             include:  {
//                 model: SpotImage,
//                 attributes: ["url", "preview"],
//             }
//         })

//         let previewImage;
//         const updatedSpots = spots.map(spot => {
//             //console.log(spot.toJSON())
//             const {SpotImages, ...rest} = spot.toJSON()
//             SpotImages.forEach(spotimage => {
//                 if(spotimage.preview) {
//                     previewImage = spotimage.url
//                 }
//                 else {
//                     previewImage = null
//                 }
//             })
//             return {
//                 ...rest,
//                 previewImage
//             }
//          })

//         return res.json({
//             Spots: updatedSpots
//           });
//     })
//Create a Spot
router.post(
    "/",
    requireAuth,
    validateSignup,
    async (req, res, next) => {
        const {user} = req;
        let { address, city, state, country, lat, lng, name, description, price } =
        req.body;
        const currentUser = await User.findByPk(user.id);
        const newSpot = await currentUser.createSpot({
            "ownerId":user.id, address, city, state, country, lat, lng, name, description, price});
        return res.status(201).json(newSpot);
    }
);


//Get all Spots owned by the Current User
router.get(
    "/sessions",
    requireAuth,
    async (req, res, next) => {
        const {user} = req
        //console.log("userid is", user.id)
        const spots = await Spot.findAll(
            {
                where: {ownerId: user.id},
                include:  {
                    model: SpotImage,
                    attributes: ["url", "preview"],
                }
            }
        )

        let previewImage;
        const updatedSpots = spots.map(spot => {
            const {SpotImages, ...rest} = spot.toJSON()
            if(SpotImages.length){
                SpotImages.forEach(spotimage => {
                    if(spotimage.preview) {
                        previewImage = spotimage.url
                    }
                    else {
                        previewImage = null
                    }
                })
            }
            else{
                previewImage = null
            }
            return {
                ...rest,
                previewImage
            }
         })

        return res.json({
            Spots: updatedSpots
          });
    });

//Get details of a Spot from an id
router.get(
    "/:spotId",
    async (req, res, next) => {
        const {spotId} = req.params
        const spot = await Spot.findByPk(spotId,
            {
                include :[
                    {
                        model: Review,
                        attributes:[
                            [sequelize.fn("COUNT", sequelize.col("review")), "numReviews"],
                            [sequelize.fn("AVG", sequelize.col("stars")), "avgStarRating"],
                        ]
                    },
                    {
                        model: SpotImage,
                        attributes: ["id", "url", "preview"]
                    },
                    {
                        model: User,
                        as: 'Owner',
                        attributes: ["id", "firstName", "lastName"]
                    }
                ]
            })
        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }
        const {Reviews, Owner, SpotImages, ...rest} = spot.toJSON()
        let updateSpot = {}
        updateSpot = {...rest, ...Reviews[0], SpotImages, Owner}
        return res.json(updateSpot);
    });

//Add an Image to a Spot based on the Spot's id
router.post("/:spotId/images",
            requireAuth,
            async (req, res, next) => {
                let { url, preview } = req.body;
                const spotId = Number(req.params.spotId);
                const { user } = req;
                const currSpot = await Spot.findByPk(spotId);
                if (!currSpot) {
                    const err = new Error("Spot couldn't be found");
                    err.status = 404;
                    return next(err);
                }
                const newSpotImage = await currSpot.createSpotImage({url, preview});
                //const spot = await SpotImage.findOne()
                return res.json({
                    id: newSpotImage.id,
                    url: newSpotImage.url,
                    preview: newSpotImage.preview,
                });
             });


//edit a spot
router.put(
    "/:spotId",
    requireAuth,
    validateSignup,
    async (req, res, next) => {
        const {spotId} = req.params
        const {user} = req
        const spot = await Spot.findByPk(spotId)
        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }
        //Only the owner of the spot is authorized to edit
        if (spot.ownerId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }
        const updatedSpot = await spot.update(req.body);
        return res.json(updatedSpot)
    });

//delete a spot
router.delete(
    "/:spotId",
    requireAuth,
    async (req, res, next) => {
        const {spotId} = req.params
        const {user} = req
        const spot = await Spot.findByPk(spotId)
        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }
        //Only the owner of the spot is authorized to delete
        if (spot.ownerId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }
        await spot.destroy();
        return res.json({
            "message": "Successfully deleted"
          })
    })

//create a Review for a Spot based on the Spot's id
  router.post(
    "/:spotId/reviews",
    requireAuth,
    validateReviews,
    async (req, res, next) => {
        const spotId = Number(req.params.spotId);
        const {user} = req;
        let { review, stars  } = req.body;
        const curSpot = await Spot.findByPk(spotId);
        if (!curSpot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        };
        const review_user = await Review.findOne({
            where: {userId: user.id, spotId: spotId}
        })
        if(review_user) {
            const err = new Error("User already has a review for this spot");
            err.status = 500;
            return next(err);
        }
        const newReview = await curSpot.createReview({
            "userId":user.id, review, stars});
        return res.status(201).json(newReview);
    }
);

//create a Booking for a Spot based on the Spot's id
router.post(
    "/:spotId/bookings",
    requireAuth,
    validateBooking,
    async (req, res, next) => {
        const spotId = Number(req.params.spotId);
        const {user} = req;
        let { startDate, endDate  } = req.body;
        const curSpot = await Spot.findByPk(spotId);
        if (!curSpot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        };
        if (curSpot.ownerId === user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
        const curBookings = await Booking.findAll({
            where: {spotId: spotId}
        })

        if(curBookings.length) {
            if(endDate > startDate) {
                curBookings.forEach(booking => {
                    const start_exist = new Date(booking.startDate);
                    const end_exist = new Date(booking.endDate);
                    const start = new Date(startDate)
                    const end = new Date(endDate);
                if(start_exist <= start && end_exist>= end) {
                    const err = new Error("Sorry, this spot is already booked for the specified dates");
                    err.status = 403;
                    return next(err);
                }
                if (start >= start_exist && start <= end_exist) {
                    const err = new Error("Sorry, this spot is already booked for the specified dates");
                    err.status = 403;
                    err.errors = {}
                    err.errors.startDate = "Start date conflicts with an existing booking"
                    return next(err);
                }

                if (end >= start_exist && end <= end_exist) {
                    const err = new Error("Sorry, this spot is already booked for the specified dates");
                    err.status = 403;
                    err.errors = {}
                    err.errors.endDate = "End date conflicts with an existing booking"
                    return next(err);
                }
                }
            )}
        }
        const newBooking = await curSpot.createBooking({
            "userId":user.id, startDate, endDate});
        return res.status(201).json(newBooking);
    }
)


//Get all Reviews by a Spot's id
router.get(
    "/:spotId/reviews",
    async (req, res, next) => {
        const {spotId} = req.params
        const spot = await Spot.findByPk(spotId)
        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        };
        const reviews = await Review.findAll({
            where: {
                spotId
            },
            include: {
                model: ReviewImage,
                attributes: ["id", "url"]
            }
        })
        return res.json({Reviews: reviews});
    });

//Get all bookings by a Spot's id
router.get(
    "/:spotId/bookings",
    requireAuth,
    async (req, res, next) => {
        const {spotId} = req.params
        const {user} = req
        const spot = await Spot.findByPk(spotId)
        if (!spot) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        };
        if (spot.ownerId === user.id) {
            const bookings = await Booking.findAll({
                where: {
                    spotId
                },
                include: {
                    model: User,
                    attributes: ["id", "firstName", "lastName"]
                },
                //attributes: ["spotId", "startDate", "endDate"]
                }
            )
            return res.json({Bookings: bookings});
        }
        else {
            const bookings = await Booking.findAll({
                where: {
                    spotId
                },
                attributes: ["spotId", "startDate", "endDate"]
                }
            )
            return res.json({Bookings: bookings});
        }
    });



//Get all spots and querying
router.get(
    "/",
    validateQuery,
    async (req, res, next) => {
    let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } =
      req.query;

    const pagination = {}
    if (!page) page = 1
    if (!size) size = 20

    page = parseInt(page)
    size = parseInt(size)

    if (page >= 1 && size >= 1) {
    pagination.limit = size
    pagination.offset = size * (page - 1)
    }

    // search parameters
    const where = {}
    if (minLat) where.lat = { [Op.gt]: minLat }
    if (maxLat) where.lat = { [Op.lt]: maxLat }
    if (minLng) where.lng = { [Op.gt]: minLng }
    if (maxLng) where.lng = { [Op.lt]: maxLng }
    if (minPrice) where.price = { [Op.gt]: minPrice }
    if (maxPrice) where.price = { [Op.lt]: maxPrice }

    const allSpotsData = await Spot.findAll({
        where,
        ...pagination
      })

    const updatedSpots = [];
    for (let i = 0; i < allSpotsData.length; i++) {
        let spot = allSpotsData[i].toJSON()
        const spotImage = await SpotImage.findOne({
          where: { spotId: spot.id, preview: true },
        });
        console.log("this is current llopp----------")
        if(spotImage) {
            spot.previewImage = spotImage.url
        }
        else {
            spot.previewImage = null
        }

        let starRating = await allSpotsData[i].getReviews({
                attributes: [
                    [sequelize.fn('ROUND', sequelize.fn('AVG', sequelize.col('stars')), 1), 'avgRating']
                ]
                })
        console.log("this is cur star rating:", starRating)
        if(starRating[0].toJSON().avgRating) {
            spot.avgRating = starRating[0].toJSON().avgRating
        }
        else{
            spot.avgRating = 0
        }
        updatedSpots.push({
            ...spot,
          });
      };


      return res.json({Spots: updatedSpots, page, size})
  });

module.exports = router;
