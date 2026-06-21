const User = require("../model/userSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");

// GET /api/v1/users
const getAllUsers = asyncHandler(async (req, res) => {
    const { role, isActive, search } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === "true";
    if (search) {
        filter.$or = [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { phone: { $regex: search, $options: "i" } },
        ];
    }

    const [users, total] = await Promise.all([
        User.find(filter).select("-password").populate("flatId").skip(skip).limit(limit).sort(sort),
        User.countDocuments(filter),
    ]);

    res.status(200).json(
        new ApiResponse(200, { users, pagination: paginationMeta(total, page, limit) }, "Users fetched.")
    );
});

// GET /api/v1/users/:id
const getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password").populate("flatId");
    if (!user) throw new ApiError(404, "User not found.");
    res.status(200).json(new ApiResponse(200, { user }, "User fetched."));
});

// PUT /api/v1/users/:id
const updateUser = asyncHandler(async (req, res) => {
    const { name, email, phone, role, flatId, isActive } = req.body;
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;
    if (flatId !== undefined) updateData.flatId = flatId;
    if (isActive !== undefined) updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(req.params.id, { $set: updateData }, { returnDocument: 'after', runValidators: true }).select("-password");
    if (!user) throw new ApiError(404, "User not found.");
    res.status(200).json(new ApiResponse(200, { user }, "User updated."));
});

// DELETE /api/v1/users/:id
const deleteUser = asyncHandler(async (req, res) => {
    if (req.params.id === req.user._id.toString()) {
        throw new ApiError(400, "You cannot delete your own account.");
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");
    res.status(200).json(new ApiResponse(200, null, "User deleted."));
});

// PUT /api/v1/users/:id/toggle-active
const toggleActive = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) throw new ApiError(404, "User not found.");
    user.isActive = !user.isActive;
    await user.save();
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(200).json(new ApiResponse(200, { user: userResponse }, `User ${user.isActive ? "activated" : "deactivated"}.`));
});

module.exports = { getAllUsers, getUserById, updateUser, deleteUser, toggleActive };
