const Notification = require("../model/notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");

// GET /api/v1/notifications
const getNotifications = asyncHandler(async (req, res) => {
    const { isRead } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = { userId: req.user._id };
    if (isRead !== undefined) filter.isRead = isRead === "true";

    const [notifications, total, unreadCount] = await Promise.all([
        Notification.find(filter).skip(skip).limit(limit).sort(sort),
        Notification.countDocuments(filter),
        Notification.countDocuments({ userId: req.user._id, isRead: false }),
    ]);

    res.status(200).json(new ApiResponse(200, {
        notifications,
        unreadCount,
        pagination: paginationMeta(total, page, limit),
    }, "Notifications fetched."));
});

// PUT /api/v1/notifications/:id/read
const markRead = asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) throw new ApiError(404, "Notification not found.");

    notification.isRead = true;
    await notification.save();

    res.status(200).json(new ApiResponse(200, { notification }, "Marked as read."));
});

// PUT /api/v1/notifications/read-all
const markAllRead = asyncHandler(async (req, res) => {
    const result = await Notification.updateMany(
        { userId: req.user._id, isRead: false },
        { $set: { isRead: true } }
    );

    res.status(200).json(new ApiResponse(200, { modifiedCount: result.modifiedCount }, "All notifications marked as read."));
});

module.exports = { getNotifications, markRead, markAllRead };
