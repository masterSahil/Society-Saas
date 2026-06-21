const Booking = require("../model/bookingSchema");
const Facility = require("../model/facilitySchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");
const { createNotification, broadcastToRole } = require("../services/notificationService");

// GET /api/v1/bookings
const getBookings = asyncHandler(async (req, res) => {
    const { status, facilityId, date } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (req.user.role === "resident") filter.residentId = req.user._id;
    if (status) filter.status = status;
    if (facilityId) filter.facilityId = facilityId;
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        filter.bookingDate = { $gte: start, $lte: end };
    }

    const [bookings, total] = await Promise.all([
        Booking.find(filter)
            .populate("residentId", "name email")
            .populate("facilityId", "facilityName")
            .skip(skip).limit(limit).sort(sort),
        Booking.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { bookings, pagination: paginationMeta(total, page, limit) }, "Bookings fetched."));
});

// GET /api/v1/bookings/:id
const getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate("residentId", "name email")
        .populate("facilityId", "facilityName capacity");
    if (!booking) throw new ApiError(404, "Booking not found.");
    res.status(200).json(new ApiResponse(200, { booking }, "Booking fetched."));
});

// POST /api/v1/bookings
const createBooking = asyncHandler(async (req, res) => {
    const { facilityId, bookingDate, startTime, endTime } = req.body;

    const facility = await Facility.findById(facilityId);
    if (!facility) throw new ApiError(404, "Facility not found.");
    if (!facility.isActive) throw new ApiError(400, "Facility is not available.");

    // Check for time slot conflicts
    const conflict = await Booking.findOne({
        facilityId,
        bookingDate: new Date(bookingDate),
        status: { $in: ["Pending", "Approved"] },
        $or: [
            { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        ],
    });
    if (conflict) throw new ApiError(409, "This time slot is already booked.");

    const booking = await Booking.create({
        residentId: req.user._id,
        facilityId,
        bookingDate,
        startTime,
        endTime,
    });

    await broadcastToRole("admin", "New Booking Request", `${facility.facilityName} booking on ${bookingDate}.`);

    const populated = await Booking.findById(booking._id).populate("facilityId", "facilityName");
    res.status(201).json(new ApiResponse(201, { booking: populated }, "Booking created."));
});

// PUT /api/v1/bookings/:id/approve
const approveBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate("facilityId", "facilityName");
    if (!booking) throw new ApiError(404, "Booking not found.");
    if (booking.status !== "Pending") throw new ApiError(400, "Only pending bookings can be approved/rejected.");

    booking.status = req.body.status;
    await booking.save();

    await createNotification(booking.residentId, "Booking Update", `Your booking for ${booking.facilityId.facilityName} has been ${req.body.status.toLowerCase()}.`);

    res.status(200).json(new ApiResponse(200, { booking }, `Booking ${req.body.status.toLowerCase()}.`));
});

// PUT /api/v1/bookings/:id/cancel
const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);
    if (!booking) throw new ApiError(404, "Booking not found.");

    if (booking.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only cancel your own bookings.");
    }
    if (booking.status === "Cancelled") throw new ApiError(400, "Booking is already cancelled.");

    booking.status = "Cancelled";
    await booking.save();

    res.status(200).json(new ApiResponse(200, { booking }, "Booking cancelled."));
});

module.exports = { getBookings, getBookingById, createBooking, approveBooking, cancelBooking };
