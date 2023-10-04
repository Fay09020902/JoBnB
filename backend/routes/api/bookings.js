const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Booking, Spot, ReviewImage, SpotImage } = require('../../db/models');
const e = require('express');
const { where } = require('sequelize');

const router = express.Router();

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

  //Get all bookings owned by the Current User
  router.get(
      "/current",
      requireAuth,
      async (req, res, next) => {
          const {user} = req
          const bookings = await Booking.findAll(
              {
                  where: {userId: user.id},
                  include:  [
                    {
                        model:Spot,
                        attributes: {exclude: ["description", "description", "createdAt", "updatedAt","avgRating"]},
                        include: {
                            model: SpotImage,
                            attributes: ["url", "preview"]
                        }
                    },
                ]
              }
          )

          const updatedBookings = bookings.map(booking => {
            const {Spot,  ...rest} = booking.toJSON()
            const {SpotImages, ...rest1} = Spot
            if(SpotImages.length) {
                SpotImages.forEach(spotimage => {
                    if(spotimage.preview) {
                    Spot.previewImage = spotimage.url
                    }
                    else {
                        Spot.previewImage = null
                    }
                })
            }
            else {
                Spot.previewImage = null
            }
            return {
                ...rest,
                Spot: {
                    ...rest1,
                    previewImage: Spot.previewImage
                },
            }
         })

         res.json({bookings: updatedBookings})
        }
      );

//edit a booking
router.put(
    "/:bookingId",
    requireAuth,
    validateBooking,
    async (req, res, next) => {
        const {bookingId} = req.params
        const {startDate, endDate} = req.body
        const {user} = req
        const booking = await Booking.findByPk(bookingId)
        if (!booking) {
            const err = new Error("Booking couldn't be found");
            err.status = 404;
            return next(err);
        }

        //Only the owner of the booking is authorized to edit
        if (booking.userId !== user.id) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }
        //Can't edit a booking that's past the end date
        if (new Date(booking.endDate) < new Date()) {
            const err = new Error("Past bookings can't be modified");
            err.status = 403;
            return next(err);
        }

        const bookedDates = await Booking.findAll(
            {
                where: {
                    spotId: booking.spotId,
                    id: {
                      [Op.not]: bookingId
                    }
                  }
        }
        )
        if(bookedDates.length) {
            for (let booking of bookedDates) {

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
             //dates surrond existing boooking
             if(start<= start_exist && end >= end_exist) {
                const err = new Error("Sorry, this spot is already booked for the specified dates");
                err.status = 403;
                return next(err);
            }
           }
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
        const booking = await Booking.findByPk(bookingId,
            {include: {
                model: Spot,
                attributes: ["ownerId"]
            }})
        console.log(booking)

        if (!booking) {
            const err = new Error("Spot couldn't be found");
            err.status = 404;
            return next(err);
        }
        //Only the owner of the booking or the owner of the spot is authorized to
//delete the booking
//console.log("(booking.userId !== user.id)",(booking.userId !== user.id))
        if ( booking.userId !== user.id ) {
            if(booking.Spot.ownerId !== user.id){
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
        }
        }
        await booking.destroy();
        return res.json({
            "message": "Successfully deleted"
          })
    })
module.exports = router;
