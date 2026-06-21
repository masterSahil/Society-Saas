const { body, param, query } = require("express-validator");
const { ALL_ROLES } = require("../utils/constants");
const mongoose = require("mongoose");

const objectIdValidator = (field) =>
    param(field)
        .custom((val) => mongoose.Types.ObjectId.isValid(val))
        .withMessage(`${field} must be a valid ID.`);

const updateUserValidator = [
    body("name").optional().trim().isLength({ min: 2, max: 100 }).withMessage("Name must be 2–100 characters."),
    body("email").optional().trim().isEmail().withMessage("Invalid email.").normalizeEmail(),
    body("phone").optional().trim().isMobilePhone().withMessage("Invalid phone number."),
    body("role").optional().isIn(ALL_ROLES).withMessage(`Role must be one of: ${ALL_ROLES.join(", ")}`),
    body("isActive").optional().isBoolean().withMessage("isActive must be boolean."),
];

module.exports = { objectIdValidator, updateUserValidator };
