const Vehicle = require("../model/vehicleSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// GET /api/v1/vehicles
const getVehicles = asyncHandler(async (req, res) => {
    let filter = {};

    if (req.user.role === "resident") {
        filter.residentId = req.user._id;
    } else if (req.query.residentId) {
        filter.residentId = req.query.residentId;
    }
    if (req.query.vehicleType) filter.vehicleType = req.query.vehicleType;

    const vehicles = await Vehicle.find(filter).populate("residentId", "name email flatId");
    res.status(200).json(new ApiResponse(200, { vehicles }, "Vehicles fetched."));
});

// POST /api/v1/vehicles
const addVehicle = asyncHandler(async (req, res) => {
    const { vehicleNumber, vehicleType, brand, color } = req.body;
    const vehicle = await Vehicle.create({ residentId: req.user._id, vehicleNumber, vehicleType, brand, color });
    res.status(201).json(new ApiResponse(201, { vehicle }, "Vehicle added."));
});

// PUT /api/v1/vehicles/:id
const updateVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) throw new ApiError(404, "Vehicle not found.");
    if (vehicle.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own vehicles.");
    }

    const updated = await Vehicle.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after', runValidators: true });
    res.status(200).json(new ApiResponse(200, { vehicle: updated }, "Vehicle updated."));
});

// DELETE /api/v1/vehicles/:id
const deleteVehicle = asyncHandler(async (req, res) => {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) throw new ApiError(404, "Vehicle not found.");

    if (req.user.role !== "admin" && vehicle.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }

    await Vehicle.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Vehicle deleted."));
});

module.exports = { getVehicles, addVehicle, updateVehicle, deleteVehicle };
