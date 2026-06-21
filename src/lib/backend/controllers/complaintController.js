const Complaint = require("../model/complainSchema");
const User = require("../model/userSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");
const { createNotification, broadcastToRole } = require("../services/notificationService");

// GET /api/v1/complaints
const getComplaints = asyncHandler(async (req, res) => {
    const { status, category } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (req.user.role === "resident") filter.residentId = req.user._id;
    if (req.user.role === "maintenance") filter.assignedTo = req.user._id;
    if (status) filter.status = status;
    if (category) filter.category = category;

    const [complaints, total] = await Promise.all([
        Complaint.find(filter)
            .populate("residentId", "name email flatId")
            .populate("assignedTo", "name email")
            .skip(skip).limit(limit).sort(sort),
        Complaint.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { complaints, pagination: paginationMeta(total, page, limit) }, "Complaints fetched."));
});

// GET /api/v1/complaints/:id
const getComplaintById = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id)
        .populate("residentId", "name email phone flatId")
        .populate("assignedTo", "name email phone");
    if (!complaint) throw new ApiError(404, "Complaint not found.");

    // Access check
    if (req.user.role === "resident" && complaint.residentId._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }
    if (req.user.role === "maintenance" && complaint.assignedTo?._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }

    res.status(200).json(new ApiResponse(200, { complaint }, "Complaint fetched."));
});

// POST /api/v1/complaints
const createComplaint = asyncHandler(async (req, res) => {
    const { category, title, description } = req.body;

    const complaint = await Complaint.create({
        residentId: req.user._id,
        category,
        title,
        description,
        image: req.file ? req.file.path : undefined,
    });

    // Notify admins
    await broadcastToRole("admin", "New Complaint", `${title} — ${category}`);

    res.status(201).json(new ApiResponse(201, { complaint }, "Complaint created."));
});

// PUT /api/v1/complaints/:id
const updateComplaint = asyncHandler(async (req, res) => {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) throw new ApiError(404, "Complaint not found.");

    if (req.user.role === "resident" && complaint.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only edit your own complaints.");
    }
    if (complaint.status !== "Open") {
        throw new ApiError(400, "Only open complaints can be edited.");
    }

    const updateData = {};
    if (req.body.title) updateData.title = req.body.title;
    if (req.body.description) updateData.description = req.body.description;
    if (req.body.category) updateData.category = req.body.category;
    if (req.file) updateData.image = req.file.path;

    const updated = await Complaint.findByIdAndUpdate(req.params.id, { $set: updateData }, { returnDocument: 'after', runValidators: true });
    res.status(200).json(new ApiResponse(200, { complaint: updated }, "Complaint updated."));
});

// PUT /api/v1/complaints/:id/assign
const assignComplaint = asyncHandler(async (req, res) => {
    const { assignedTo } = req.body;

    const staff = await User.findById(assignedTo);
    if (!staff || staff.role !== "maintenance") {
        throw new ApiError(400, "Invalid maintenance staff ID.");
    }

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) throw new ApiError(404, "Complaint not found.");

    complaint.assignedTo = assignedTo;
    complaint.status = "Assigned";
    await complaint.save();

    // Notify maintenance staff
    await createNotification(assignedTo, "New Assignment", `Complaint "${complaint.title}" has been assigned to you.`);

    const populated = await Complaint.findById(complaint._id)
        .populate("residentId", "name email")
        .populate("assignedTo", "name email");

    res.status(200).json(new ApiResponse(200, { complaint: populated }, "Complaint assigned."));
});

// PUT /api/v1/complaints/:id/status
const updateStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) throw new ApiError(404, "Complaint not found.");

    // Maintenance can only update complaints assigned to them
    if (req.user.role === "maintenance" && complaint.assignedTo?.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update complaints assigned to you.");
    }

    complaint.status = status;
    await complaint.save();

    // Notify resident about status change
    if (complaint.residentId) {
        await createNotification(complaint.residentId, "Complaint Update", `Your complaint "${complaint.title}" is now "${status}".`);
    }

    res.status(200).json(new ApiResponse(200, { complaint }, "Status updated."));
});

module.exports = { getComplaints, getComplaintById, createComplaint, updateComplaint, assignComplaint, updateStatus };
