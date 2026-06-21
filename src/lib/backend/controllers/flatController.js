const Flat = require("../model/flatSchema");
const User = require("../model/userSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");

// GET /api/v1/flats
const getAllFlats = asyncHandler(async (req, res) => {
    const { block, status, flatType, search } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (block) filter.block = block;
    if (status) filter.status = status;
    if (flatType) filter.flatType = flatType;
    if (search) filter.flatNumber = { $regex: search, $options: "i" };

    const [flats, total] = await Promise.all([
        Flat.find(filter).skip(skip).limit(limit).sort(sort),
        Flat.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { flats, pagination: paginationMeta(total, page, limit) }, "Flats fetched."));
});

// GET /api/v1/flats/:id
const getFlatById = asyncHandler(async (req, res) => {
    const flat = await Flat.findById(req.params.id);
    if (!flat) throw new ApiError(404, "Flat not found.");

    // Also find the resident assigned to this flat
    const resident = await User.findOne({ flatId: flat._id }).select("-password");

    res.status(200).json(new ApiResponse(200, { flat, resident }, "Flat fetched."));
});

// POST /api/v1/flats
const createFlat = asyncHandler(async (req, res) => {
    const { block, floor, flatNumber, flatType } = req.body;

    const existing = await Flat.findOne({ flatNumber, block });
    if (existing) throw new ApiError(409, "Flat already exists in this block.");

    const flat = await Flat.create({ block, floor, flatNumber, flatType });
    res.status(201).json(new ApiResponse(201, { flat }, "Flat created."));
});

// PUT /api/v1/flats/:id
const updateFlat = asyncHandler(async (req, res) => {
    const flat = await Flat.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after', runValidators: true });
    if (!flat) throw new ApiError(404, "Flat not found.");
    res.status(200).json(new ApiResponse(200, { flat }, "Flat updated."));
});

// DELETE /api/v1/flats/:id
const deleteFlat = asyncHandler(async (req, res) => {
    const flat = await Flat.findById(req.params.id);
    if (!flat) throw new ApiError(404, "Flat not found.");
    if (flat.status === "occupied") throw new ApiError(400, "Cannot delete an occupied flat. Vacate it first.");

    await Flat.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Flat deleted."));
});

// PUT /api/v1/flats/:id/assign
const assignFlat = asyncHandler(async (req, res) => {
    const { residentId } = req.body;

    const flat = await Flat.findById(req.params.id);
    if (!flat) throw new ApiError(404, "Flat not found.");
    if (flat.status === "occupied") throw new ApiError(400, "Flat is already occupied.");

    const user = await User.findById(residentId);
    if (!user) throw new ApiError(404, "Resident not found.");
    if (user.role !== "resident") throw new ApiError(400, "Only residents can be assigned to flats.");

    // Update flat status
    flat.status = "occupied";
    await flat.save();

    // Assign flat to user
    user.flatId = flat._id;
    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(new ApiResponse(200, { flat, user: userResponse }, "Flat assigned to resident."));
});

module.exports = { getAllFlats, getFlatById, createFlat, updateFlat, deleteFlat, assignFlat };
