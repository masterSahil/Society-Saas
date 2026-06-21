const { body } = require("express-validator");
const { COMPLAINT_CATEGORIES, COMPLAINT_STATUS } = require("../utils/constants");

const createComplaintValidator = [
    body("category").notEmpty().withMessage("Category is required.").isIn(COMPLAINT_CATEGORIES).withMessage(`Category must be one of: ${COMPLAINT_CATEGORIES.join(", ")}`),
    body("title").trim().notEmpty().withMessage("Title is required.").isLength({ max: 200 }).withMessage("Title max 200 characters."),
    body("description").trim().notEmpty().withMessage("Description is required."),
];

const updateComplaintValidator = [
    body("category").optional().isIn(COMPLAINT_CATEGORIES).withMessage(`Category must be one of: ${COMPLAINT_CATEGORIES.join(", ")}`),
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty."),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty."),
];

const assignComplaintValidator = [
    body("assignedTo").notEmpty().withMessage("Maintenance staff ID is required.").isMongoId().withMessage("Invalid user ID."),
];

const updateStatusValidator = [
    body("status").notEmpty().withMessage("Status is required.").isIn(Object.values(COMPLAINT_STATUS)).withMessage(`Status must be one of: ${Object.values(COMPLAINT_STATUS).join(", ")}`),
];

module.exports = { createComplaintValidator, updateComplaintValidator, assignComplaintValidator, updateStatusValidator };
