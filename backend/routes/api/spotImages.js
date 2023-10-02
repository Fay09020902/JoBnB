const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage,ReviewImage, Review, Booking } = require('../../db/models');
const e = require('express');

const router = express.Router();
//Delete an Image for a Spot
router.delete(
    "/:imageId",
    requireAuth,
    async (req, res, next) => {
        const {imageId} = req.params
        const {user} = req
        const curImg = await SpotImage.findByPk(imageId, {
            include: {
              model: Spot,
              attributes: ["ownerId"],
            },
        })
        if (!curImg) {
            const err = new Error("Spot Image couldn't be found");
            err.status = 404;
            return next(err);
        }
        //Only the owner of the spot is authorized to delete
        if (user.id !== curImg.Spot.ownerId) {
            const err = new Error("Forbidden");
            err.status = 403;
            return next(err);
          }
        await curImg.destroy();
        return res.json({
            "message": "Successfully deleted"
          })
    })

module.exports = router;
