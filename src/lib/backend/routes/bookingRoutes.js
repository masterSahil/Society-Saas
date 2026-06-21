const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { createBookingValidator, approveBookingValidator } = require("../validators/bookingValidator");
const { getBookings, getBookingById, createBooking, approveBooking, cancelBooking } = require("../controllers/bookingController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), getBookings);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), getBookingById);
router.post("/", authorize(ROLES.RESIDENT), createBookingValidator, validate, createBooking);
router.put("/:id/approve", authorize(ROLES.ADMIN), approveBookingValidator, validate, approveBooking);
router.put("/:id/cancel", authorize(ROLES.RESIDENT), cancelBooking);

module.exports = router;
