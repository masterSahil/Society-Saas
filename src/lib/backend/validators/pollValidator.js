const { body } = require("express-validator");

const pollValidator = [
    body("question").trim().notEmpty().withMessage("Question is required."),
    body("options").isArray({ min: 2 }).withMessage("At least 2 options are required."),
    body("options.*").trim().notEmpty().withMessage("Option cannot be empty."),
    body("startDate").optional().isISO8601().withMessage("Invalid start date."),
    body("endDate").notEmpty().withMessage("End date is required.").isISO8601().withMessage("Invalid end date."),
];

const voteValidator = [
    body("selectedOption").trim().notEmpty().withMessage("Selected option is required."),
];

module.exports = { pollValidator, voteValidator };
