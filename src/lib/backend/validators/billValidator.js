const { body } = require("express-validator");

const createBillValidator = [
    body("residentId").notEmpty().withMessage("Resident ID is required.").isMongoId().withMessage("Invalid resident ID."),
    body("month").trim().notEmpty().withMessage("Month is required."),
    body("year").notEmpty().withMessage("Year is required.").isInt({ min: 2020 }).withMessage("Invalid year."),
    body("amount").notEmpty().withMessage("Amount is required.").isFloat({ min: 0 }).withMessage("Amount must be positive."),
    body("dueDate").notEmpty().withMessage("Due date is required.").isISO8601().withMessage("Invalid date format."),
];

const updateBillValidator = [
    body("month").optional().trim().notEmpty(),
    body("year").optional().isInt({ min: 2020 }),
    body("amount").optional().isFloat({ min: 0 }).withMessage("Amount must be positive."),
    body("dueDate").optional().isISO8601().withMessage("Invalid date format."),
];

const generateBillsValidator = [
    body("month").trim().notEmpty().withMessage("Month is required."),
    body("year").notEmpty().withMessage("Year is required.").isInt({ min: 2020 }),
    body("amount").notEmpty().withMessage("Amount is required.").isFloat({ min: 0 }),
    body("dueDate").notEmpty().withMessage("Due date is required.").isISO8601(),
];

module.exports = { createBillValidator, updateBillValidator, generateBillsValidator };
