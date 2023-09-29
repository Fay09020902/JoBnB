const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, booking, Spot, bookingImage, SpotImage } = require('../../db/models');
const e = require('express');

const router = express.Router();

const validatebookings = [
    check('booking')
      .exists({ checkFalsy: true })
      .withMessage('booking text is required'),
    check('stars')
      .exists({ checkFalsy: true })
      .isInt({
        min: 1,
        max: 5,
      })
      .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
  ];

//Add an Image to a booking based on the booking's id
router.post("/:bookingId/images",
            requireAuth,
            async (req, res, next) => {
                let { url} = req.body;
                const bookingId = Number(req.params.bookingId);
                const { user } = req;
                const currbooking = await booking.findByPk(bookingId);
                if (!currbooking) {
                    const err = new Error("booking couldn't be found");
                    err.status = 404;
                    return next(err);
                }
                //Only the owner of the booking is authorized to add an image
                if (currbooking.userId !== user.id) {
                    const err = new Error("Forbidden");
                    err.status = 403;
                    return next(err);
                }
                //Cannot add any more images because there is a maximum of 10 images per resource
                const numbookingImage = await bookingImage.count({where: {bookingId}})
                if(numbookingImage > 10){
                    const err = new Error("Maximum number of images for this resource was reached");
                    err.status = 403;
                    return next(err);
                }
                const newbookingImage = await currbooking.createbookingImage({url});

                return res.json({
                    id: newbookingImage.id,
                    url: newbookingImage.url,
                });
             });

  //Get all bookings owned by the Current User
  router.get(
      "/sessions",
      requireAuth,
      async (req, res, next) => {
          const {user} = req
            //console.log(spot.toJSON())
          const bookings = await booking.findAll(
              {
                  where: {userId: user.id},
                  include:  [
                    {
                      model: User,
                      attributes: ["id", "firstName", "lastName"],
                    },
                    {
                        model:Spot,
                        attributes: {exclude: ["description", "description", "createdAt", "updatedAt","avgRating"]},
                        include: {
                            model: SpotImage,
                            attributes: ["url", "pbooking"]
                        }
                    },
                    {
                    model: bookingImage,
                    attributes: ["id", "url"],
                    }
                ]
              }
          )

          const updatedbookings = bookings.map(booking => {
            const {Spot, User, bookingImages, ...rest} = booking.toJSON()
            const {SpotImages, ...rest1} = Spot
            if(SpotImages.length) {
                SpotImages.forEach(spotimage => {
                    if(spotimage.pbooking) {
                    Spot.pbookingImage = spotimage.url
                    }
                    else {
                        Spot.pbookingImage = null
                    }
                })
            }
            else {
                Spot.pbookingImage = null
            }
            return {
                ...rest,
                User,
                Spot: {
                    ...rest1,
                    pbookingImage: Spot.pbookingImage
                },
                bookingImages
            }
         })

         res.json({bookings: updatedbookings})
        }
      );

//edit a booking
router.put(
    "/:bookingId",
    requireAuth,
    validatebookings,
    async (req, res, next) => {
        const {bookingId} = req.params
        const {user} = req
        const booking = await booking.findByPk(bookingId)
        if (!booking) {
            const err = new Error("booking couldn't be found");
            err.status = 404;
            return next(err);
        }
        //Only the owner of the booking is authorized to edit
        if (booking.userId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }
        const updatedbooking = await booking.update(req.body);
        return res.json(updatedbooking)
    });

//delete a booking
router.delete(
    "/:bookingId",
    requireAuth,
    async (req, res, next) => {
        const {bookingId} = req.params
        const {user} = req
        const booking = await booking.findByPk(bookingId)
        if (!booking) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }
        //Only the owner of the booking is authorized to edit
        if (booking.userId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }
        await booking.destroy();
        return res.json({
            "message": "Successfully deleted"
          })
    })
module.exports = router;
