const Visitor = require("../model/visitorSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");
const { createNotification } = require("../services/notificationService");

// GET /api/v1/visitors
const getVisitors = asyncHandler(async (req, res) => {
    const { approvalStatus, visitorType, date } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (req.user.role === "resident") filter.residentId = req.user._id;
    if (approvalStatus) filter.approvalStatus = approvalStatus;
    if (visitorType) filter.visitorType = visitorType;
    if (date) {
        const start = new Date(date);
        start.setHours(0, 0, 0, 0);
        const end = new Date(date);
        end.setHours(23, 59, 59, 999);
        filter.createdAt = { $gte: start, $lte: end };
    }

    const [visitors, total] = await Promise.all([
        Visitor.find(filter).populate("residentId", "name email flatId").skip(skip).limit(limit).sort(sort),
        Visitor.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { visitors, pagination: paginationMeta(total, page, limit) }, "Visitors fetched."));
});

// GET /api/v1/visitors/:id
const getVisitorById = asyncHandler(async (req, res) => {
    const visitor = await Visitor.findById(req.params.id).populate("residentId", "name email flatId");
    if (!visitor) throw new ApiError(404, "Visitor not found.");
    res.status(200).json(new ApiResponse(200, { visitor }, "Visitor fetched."));
});

// POST /api/v1/visitors
const createVisitor = asyncHandler(async (req, res) => {
    const { visitorName, mobile, purpose, visitorType, residentId } = req.body;

    const visitor = await Visitor.create({
        residentId: residentId || req.user._id,
        visitorName,
        mobile,
        purpose,
        visitorType,
    });

    // Notify resident about new visitor (if created by security)
    if (req.user.role === "security" && residentId) {
        await createNotification(residentId, "New Visitor", `${visitorName} is at the gate. Please approve or reject.`);
    }

    res.status(201).json(new ApiResponse(201, { visitor }, "Visitor registered."));
});

// PUT /api/v1/visitors/:id/approve
const approveVisitor = asyncHandler(async (req, res) => {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) throw new ApiError(404, "Visitor not found.");

    // Only the resident this visitor is for can approve/reject (Admin can override)
    if (req.user.role !== "admin" && visitor.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only approve/reject visitors for your flat.");
    }
    if (visitor.approvalStatus !== "Pending") {
        throw new ApiError(400, "Visitor has already been processed.");
    }

    visitor.approvalStatus = req.body.approvalStatus;
    await visitor.save();

    res.status(200).json(new ApiResponse(200, { visitor }, `Visitor ${req.body.approvalStatus.toLowerCase()}.`));
});

// PUT /api/v1/visitors/:id/entry
const markEntry = asyncHandler(async (req, res) => {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) throw new ApiError(404, "Visitor not found.");
    if (visitor.approvalStatus !== "Approved") throw new ApiError(400, "Visitor must be approved before entry.");
    if (visitor.entryTime) throw new ApiError(400, "Entry already recorded.");

    visitor.entryTime = new Date();
    await visitor.save();

    res.status(200).json(new ApiResponse(200, { visitor }, "Entry recorded."));
});

// PUT /api/v1/visitors/:id/exit
const markExit = asyncHandler(async (req, res) => {
    const visitor = await Visitor.findById(req.params.id);
    if (!visitor) throw new ApiError(404, "Visitor not found.");
    if (!visitor.entryTime) throw new ApiError(400, "No entry recorded for this visitor.");
    if (visitor.exitTime) throw new ApiError(400, "Exit already recorded.");

    visitor.exitTime = new Date();
    await visitor.save();

    res.status(200).json(new ApiResponse(200, { visitor }, "Exit recorded."));
});

module.exports = { getVisitors, getVisitorById, createVisitor, approveVisitor, markEntry, markExit };
