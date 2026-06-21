const { body } = require("express-validator");
const { BOOKING_STATUS } = require("../utils/constants");

const createBookingValidator = [
    body("facilityId").notEmpty().withMessage("Facility ID is required.").isMongoId().withMessage("Invalid facility ID."),
    body("bookingDate").notEmpty().withMessage("Booking date is required.").isISO8601().withMessage("Invalid date."),
    body("startTime").trim().notEmpty().withMessage("Start time is required."),
    body("endTime").trim().notEmpty().withMessage("End time is required."),
];

const approveBookingValidator = [
    body("status")
        .notEmpty().withMessage("Status is required.")
        .isIn([BOOKING_STATUS.APPROVED, BOOKING_STATUS.REJECTED])
        .withMessage("Status must be Approved or Rejected."),
];

module.exports = { createBookingValidator, approveBookingValidator };
