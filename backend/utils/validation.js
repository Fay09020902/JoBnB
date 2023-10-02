const { validationResult } = require('express-validator');
const { check } = require('express-validator');

// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateQuery = [
  check("page")
    .optional()
    .isInt({
      min: 1,
      max: 10,
    })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .isInt({
      min: 1,
      max: 20,
    })
    .withMessage("Size must be greater than or equal to 1"),
  check("minLat")
    .optional()
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Minimum latitude is invalid"),
  check("maxLat")
    .optional()
    .isFloat({
      min: -90,
      max: 90,
    })
    .withMessage("Maximum latitude is invalid"),
  check("minLng")
    .optional()
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Minimum longitude is invalid"),
  check("maxLng")
    .optional()
    .isFloat({
      min: -180,
      max: 180,
    })
    .withMessage("Maximum longitude is invalid"),
  check("minPrice")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage("Minimum price must be greater than or equal to 0"),
  check("maxPrice")
    .optional()
    .isFloat({
      min: 0,
    })
    .withMessage("Maximum price must be greater than or equal to 0"),
  handleValidationErrors,
];

module.exports = {
  handleValidationErrors, validateQuery
};
