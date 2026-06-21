const { body } = require("express-validator");

const familyValidator = [
    body("name").trim().notEmpty().withMessage("Name is required."),
    body("relation").trim().notEmpty().withMessage("Relation is required."),
    body("age").optional().isInt({ min: 0, max: 150 }).withMessage("Age must be between 0 and 150."),
    body("phone").optional().trim().isMobilePhone().withMessage("Invalid phone number."),
];

const updateFamilyValidator = [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty."),
    body("relation").optional().trim().notEmpty().withMessage("Relation cannot be empty."),
    body("age").optional().isInt({ min: 0, max: 150 }).withMessage("Age must be between 0 and 150."),
    body("phone").optional().trim().isMobilePhone().withMessage("Invalid phone number."),
];

module.exports = { familyValidator, updateFamilyValidator };
