const { body } = require("express-validator");

const noticeValidator = [
    body("title").trim().notEmpty().withMessage("Title is required."),
    body("description").trim().notEmpty().withMessage("Description is required."),
    body("expiryDate").optional().isISO8601().withMessage("Invalid date format."),
];

const updateNoticeValidator = [
    body("title").optional().trim().notEmpty().withMessage("Title cannot be empty."),
    body("description").optional().trim().notEmpty().withMessage("Description cannot be empty."),
    body("expiryDate").optional().isISO8601().withMessage("Invalid date format."),
];

module.exports = { noticeValidator, updateNoticeValidator };
