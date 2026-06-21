const Facility = require("../model/facilitySchema");
const Booking = require("../model/bookingSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// GET /api/v1/facilities
const getFacilities = asyncHandler(async (req, res) => {
    const filter = {};
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === "true";

    const facilities = await Facility.find(filter).sort("facilityName");
    res.status(200).json(new ApiResponse(200, { facilities }, "Facilities fetched."));
});

// GET /api/v1/facilities/:id
const getFacilityById = asyncHandler(async (req, res) => {
    const facility = await Facility.findById(req.params.id);
    if (!facility) throw new ApiError(404, "Facility not found.");
    res.status(200).json(new ApiResponse(200, { facility }, "Facility fetched."));
});

// POST /api/v1/facilities
const createFacility = asyncHandler(async (req, res) => {
    const facility = await Facility.create(req.body);
    res.status(201).json(new ApiResponse(201, { facility }, "Facility created."));
});

// PUT /api/v1/facilities/:id
const updateFacility = asyncHandler(async (req, res) => {
    const facility = await Facility.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after', runValidators: true });
    if (!facility) throw new ApiError(404, "Facility not found.");
    res.status(200).json(new ApiResponse(200, { facility }, "Facility updated."));
});

// DELETE /api/v1/facilities/:id
const deleteFacility = asyncHandler(async (req, res) => {
    const facility = await Facility.findById(req.params.id);
    if (!facility) throw new ApiError(404, "Facility not found.");

    // Check for future bookings
    const futureBookings = await Booking.countDocuments({
        facilityId: req.params.id,
        bookingDate: { $gte: new Date() },
        status: { $in: ["Pending", "Approved"] },
    });
    if (futureBookings > 0) {
        throw new ApiError(400, `Cannot delete facility with ${futureBookings} upcoming bookings.`);
    }

    await Facility.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Facility deleted."));
});

module.exports = { getFacilities, getFacilityById, createFacility, updateFacility, deleteFacility };
