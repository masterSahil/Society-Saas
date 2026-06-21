const Family = require("../model/familySchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");

// GET /api/v1/family
const getFamily = asyncHandler(async (req, res) => {
    let filter = {};

    if (req.user.role === "admin") {
        // Admin can filter by residentId
        if (req.query.residentId) filter.residentId = req.query.residentId;
    } else {
        // Residents see only their own family
        filter.residentId = req.user._id;
    }

    const members = await Family.find(filter).populate("residentId", "name email");
    res.status(200).json(new ApiResponse(200, { members }, "Family members fetched."));
});

// GET /api/v1/family/:id
const getFamilyMember = asyncHandler(async (req, res) => {
    const member = await Family.findById(req.params.id).populate("residentId", "name email");
    if (!member) throw new ApiError(404, "Family member not found.");

    // Ownership check for residents
    if (req.user.role !== "admin" && member.residentId._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }

    res.status(200).json(new ApiResponse(200, { member }, "Family member fetched."));
});

// POST /api/v1/family
const addFamilyMember = asyncHandler(async (req, res) => {
    const { name, relation, age, phone } = req.body;

    const member = await Family.create({
        residentId: req.user._id,
        name,
        relation,
        age,
        phone,
    });

    res.status(201).json(new ApiResponse(201, { member }, "Family member added."));
});

// PUT /api/v1/family/:id
const updateFamilyMember = asyncHandler(async (req, res) => {
    const member = await Family.findById(req.params.id);
    if (!member) throw new ApiError(404, "Family member not found.");

    // Ownership check
    if (member.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own family members.");
    }

    const updated = await Family.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after', runValidators: true });
    res.status(200).json(new ApiResponse(200, { member: updated }, "Family member updated."));
});

// DELETE /api/v1/family/:id
const deleteFamilyMember = asyncHandler(async (req, res) => {
    const member = await Family.findById(req.params.id);
    if (!member) throw new ApiError(404, "Family member not found.");

    // Ownership check (admin can also delete)
    if (req.user.role !== "admin" && member.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }

    await Family.findByIdAndDelete(req.params.id);
    res.status(200).json(new ApiResponse(200, null, "Family member deleted."));
});

module.exports = { getFamily, getFamilyMember, addFamilyMember, updateFamilyMember, deleteFamilyMember };
