const { body } = require("express-validator");

const facilityValidator = [
    body("facilityName").trim().notEmpty().withMessage("Facility name is required."),
    body("description").optional().trim(),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be at least 1."),
    body("openingTime").optional().trim(),
    body("closingTime").optional().trim(),
];

const updateFacilityValidator = [
    body("facilityName").optional().trim().notEmpty().withMessage("Facility name cannot be empty."),
    body("description").optional().trim(),
    body("capacity").optional().isInt({ min: 1 }).withMessage("Capacity must be at least 1."),
    body("openingTime").optional().trim(),
    body("closingTime").optional().trim(),
    body("isActive").optional().isBoolean().withMessage("isActive must be boolean."),
];

module.exports = { facilityValidator, updateFacilityValidator };
