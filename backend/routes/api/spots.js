const express = require('express')
const bcrypt = require('bcryptjs');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const e = require('express');

const router = express.Router();



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
