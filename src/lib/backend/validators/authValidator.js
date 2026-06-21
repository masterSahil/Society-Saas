const { body } = require("express-validator");
const { ALL_ROLES } = require("../utils/constants");

const registerValidator = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required.")
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required.")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long."),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage("Please provide a valid phone number."),

    body("role")
        .optional()
        .isIn(ALL_ROLES)
        .withMessage(`Role must be one of: ${ALL_ROLES.join(", ")}`),
];

const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),

    body("password")
        .notEmpty()
        .withMessage("Password is required."),
];

const updateProfileValidator = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 100 })
        .withMessage("Name must be between 2 and 100 characters."),

    body("phone")
        .optional()
        .trim()
        .isMobilePhone()
        .withMessage("Please provide a valid phone number."),
];

const changePasswordValidator = [
    body("currentPassword")
        .notEmpty()
        .withMessage("Current password is required."),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long."),
];

const forgotPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),
];

const verifyOtpValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required."),
];

const resetPasswordValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required.")
        .isEmail()
        .withMessage("Please provide a valid email address.")
        .normalizeEmail(),

    body("otp")
        .notEmpty()
        .withMessage("OTP is required."),

    body("newPassword")
        .notEmpty()
        .withMessage("New password is required.")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long."),
];

module.exports = {
    registerValidator,
    loginValidator,
    updateProfileValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    verifyOtpValidator,
    resetPasswordValidator,
};
