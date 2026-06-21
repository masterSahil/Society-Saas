const { body } = require("express-validator");
const { FLAT_TYPES, FLAT_STATUS } = require("../utils/constants");

const createFlatValidator = [
    body("flatNumber").trim().notEmpty().withMessage("Flat number is required."),
    body("block").optional().trim(),
    body("floor").optional().isInt({ min: 0 }).withMessage("Floor must be a non-negative integer."),
    body("flatType").optional().isIn(FLAT_TYPES).withMessage(`Flat type must be one of: ${FLAT_TYPES.join(", ")}`),
];

const updateFlatValidator = [
    body("flatNumber").optional().trim().notEmpty().withMessage("Flat number cannot be empty."),
    body("block").optional().trim(),
    body("floor").optional().isInt({ min: 0 }).withMessage("Floor must be a non-negative integer."),
    body("flatType").optional().isIn(FLAT_TYPES).withMessage(`Flat type must be one of: ${FLAT_TYPES.join(", ")}`),
    body("status").optional().isIn(Object.values(FLAT_STATUS)).withMessage("Invalid flat status."),
];

const assignFlatValidator = [
    body("residentId").notEmpty().withMessage("Resident ID is required.").isMongoId().withMessage("Invalid resident ID."),
];

module.exports = { createFlatValidator, updateFlatValidator, assignFlatValidator };
