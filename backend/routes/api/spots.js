const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User, Spot, SpotImage } = require('../../db/models');
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

//Get all Spots
router.get(
    "/",
    async (req, res, next) => {
        const spots = await Spot.findAll({
            include:  {
                model: SpotImage,
                attributes: ["url", "preview"],
            }
        })

        let previewImage;
        const updatedSpots = spots.map(spot => {
            //console.log(spot.toJSON())
            const {SpotImages, ...rest} = spot.toJSON()
            SpotImages.forEach(spotimage => {
                if(spotimage.preview) {
                    previewImage = spotimage.url
                }
                else {
                    previewImage = null
                }
            })
            return {
                ...rest,
                previewImage
            }
         })

        return res.json({
            Spots: updatedSpots
          });
    })
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
            //console.log(spot.toJSON())
            const {SpotImages, ...rest} = spot.toJSON()
            SpotImages.forEach(spotimage => {
                if(spotimage.preview) {
                    previewImage = spotimage.url
                }
                else {
                    previewImage = null
                }
            })
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
        const spot = await Spot.findByPk(spotId)
        return res.json(spot);
    });

//Add an Image to a Spot based on the Spot's id
//Create and return

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
        res.json(updatedSpot)
    });



//
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
