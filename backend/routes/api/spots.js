const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot } = require('../../db/models');
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
];

//Get all Spots
router.get(
    "/",
    validateSignup,
    async (req, res, next) => {
        const spots = await Spot.findAll()
        return res.json({
            Spots: spots
          });
    })
//Create a Spot
router.post(
    "/",
    validateSignup,
    requireAuth,
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
    validateSignup,
    requireAuth,
    async (req, res, next) => {
        ///console.log("req is ", req)
        const {user} = req
        console.log("userid is", user.id)
        const spots = await Spot.findAll(
            {where: {ownerId: user.id}}
        )
        return res.json({
            Spots: spots
          });
    });

//Get details of a Spot from an id
router.get(
    "/:spotId",
    validateSignup,
    async (req, res, next) => {
        const {spotId} = req.params
        const spot = await Spot.findByPk(spotId)
        return res.json(spot);
    });
// router.delete("/:id", async (req, res, next) => {
//     const treeToDelete = await User.findByPk(req.params.id);

//     if (!treeToDelete) {
//         next({
//             status: "not-found",
//             message: `Could not remove tree ${req.params.id}`,
//             details: "Tree not found",
//         });
//     }

//     try {
//         await treeToDelete.destroy();

//         res.json({
//             status: "success",
//             message: `Successfully removed tree ${req.params.id}`,
//         });
//     } catch (err) {
//         next({
//             status: "error",
//             message: `Could not remove tree ${req.params.id}`,
//             details: err.errors
//                 ? err.errors.map((item) => item.message).join(", ")
//                 : err.message,
//         });
//     }
// });

module.exports = router;
