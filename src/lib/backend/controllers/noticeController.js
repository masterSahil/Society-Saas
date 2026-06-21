const Notice = require("../model/noticeSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");
const { broadcastNotification } = require("../services/notificationService");

// GET /api/v1/notices
const getNotices = asyncHandler(async (req, res) => {
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    // Optionally filter out expired notices
    if (req.query.active === "true") {
        filter.$or = [
            { expiryDate: { $gte: new Date() } },
            { expiryDate: null },
        ];
    }

    const [notices, total] = await Promise.all([
        Notice.find(filter).populate("createdBy", "name").skip(skip).limit(limit).sort(sort),
        Notice.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { notices, pagination: paginationMeta(total, page, limit) }, "Notices fetched."));
});

// GET /api/v1/notices/:id
const getNoticeById = asyncHandler(async (req, res) => {
    const notice = await Notice.findById(req.params.id).populate("createdBy", "name");
    if (!notice) throw new ApiError(404, "Notice not found.");
    res.status(200).json(new ApiResponse(200, { notice }, "Notice fetched."));
});

// POST /api/v1/notices
const createNotice = asyncHandler(async (req, res) => {
    const { title, description, expiryDate } = req.body;

    const notice = await Notice.create({
        title,
        description,
        createdBy: req.user._id,
        expiryDate,
    });

    // Broadcast notification to all users
    await broadcastNotification("New Notice", title);

    res.status(201).json(new ApiResponse(201, { notice }, "Notice created."));
});

// PUT /api/v1/notices/:id
const updateNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after', runValidators: true });
    if (!notice) throw new ApiError(404, "Notice not found.");
    res.status(200).json(new ApiResponse(200, { notice }, "Notice updated."));
});

// DELETE /api/v1/notices/:id
const deleteNotice = asyncHandler(async (req, res) => {
    const notice = await Notice.findByIdAndDelete(req.params.id);
    if (!notice) throw new ApiError(404, "Notice not found.");
    res.status(200).json(new ApiResponse(200, null, "Notice deleted."));
});

module.exports = { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice };
