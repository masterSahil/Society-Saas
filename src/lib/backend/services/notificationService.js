const Notification = require("../model/notification");
const User = require("../model/userSchema");

/**
 * Create a single notification for a specific user.
 */
const createNotification = async (userId, title, message) => {
    return Notification.create({ userId, title, message });
};

/**
 * Broadcast a notification to all active users.
 */
const broadcastNotification = async (title, message) => {
    const users = await User.find({ isActive: true }).select("_id");
    const notifications = users.map((u) => ({
        userId: u._id,
        title,
        message,
    }));
    return Notification.insertMany(notifications);
};

/**
 * Broadcast a notification to all active users with a specific role.
 */
const broadcastToRole = async (role, title, message) => {
    const users = await User.find({ isActive: true, role }).select("_id");
    const notifications = users.map((u) => ({
        userId: u._id,
        title,
        message,
    }));
    if (notifications.length > 0) {
        return Notification.insertMany(notifications);
    }
    return [];
};

module.exports = {
    createNotification,
    broadcastNotification,
    broadcastToRole,
};
