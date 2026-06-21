const User = require("../model/userSchema");
const Flat = require("../model/flatSchema");
const Complaint = require("../model/complainSchema");
const Bill = require("../model/billSchema");
const Visitor = require("../model/visitorSchema");
const Booking = require("../model/bookingSchema");
const Notice = require("../model/noticeSchema");
const Notification = require("../model/notification");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");

// GET /api/v1/dashboard/admin
const adminDashboard = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        totalResidents,
        totalFlats,
        occupiedFlats,
        vacantFlats,
        complaintsOpen,
        complaintsAssigned,
        complaintsInProgress,
        complaintsResolved,
        complaintsClosed,
        todayVisitors,
        recentComplaints,
        totalBillsPaid,
        totalBillsPending,
        complaintsByCategory
    ] = await Promise.all([
        User.countDocuments({ role: "resident", isActive: true }),
        Flat.countDocuments(),
        Flat.countDocuments({ status: "occupied" }),
        Flat.countDocuments({ status: "vacant" }),
        Complaint.countDocuments({ status: "Open" }),
        Complaint.countDocuments({ status: "Assigned" }),
        Complaint.countDocuments({ status: "In Progress" }),
        Complaint.countDocuments({ status: "Resolved" }),
        Complaint.countDocuments({ status: "Closed" }),
        Visitor.countDocuments({ createdAt: { $gte: today, $lt: tomorrow } }),
        Complaint.find().populate("residentId", "name flatId").sort("-createdAt").limit(5),
        Bill.aggregate([{ $match: { status: "Paid" } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
        Bill.aggregate([{ $match: { status: { $in: ["Pending", "Overdue"] } } }, { $group: { _id: null, total: { $sum: "$amount" } } }]),
        Complaint.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }])
    ]);

    // Today visitor breakdown
    const [guestsInside, expectedDeliveries, todayEntries] = await Promise.all([
        Visitor.countDocuments({ entryTime: { $ne: null }, exitTime: null }),
        Visitor.countDocuments({ visitorType: "delivery", createdAt: { $gte: today, $lt: tomorrow } }),
        Visitor.countDocuments({ entryTime: { $gte: today, $lt: tomorrow } }),
    ]);

    // Format complaint stats for the chart
    const complaintStats = complaintsByCategory.map(item => ({
        name: item._id,
        count: item.count
    }));

    res.status(200).json(new ApiResponse(200, {
        totalResidents,
        totalFlats,
        occupiedFlats,
        vacantFlats,
        complaintsByStatus: {
            Open: complaintsOpen,
            Assigned: complaintsAssigned,
            "In Progress": complaintsInProgress,
            Resolved: complaintsResolved,
            Closed: complaintsClosed,
        },
        complaintStats,
        todayVisitors: {
            total: todayVisitors,
            guestsInside,
            expectedDeliveries,
            todayEntries,
        },
        recentComplaints,
        billCollection: {
            paid: totalBillsPaid[0]?.total || 0,
            pending: totalBillsPending[0]?.total || 0,
        },
    }, "Admin dashboard data."));
});

// GET /api/v1/dashboard/resident
const residentDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const [
        pendingBills,
        activeComplaints,
        upcomingBookings,
        recentNotices,
        unreadNotifications,
    ] = await Promise.all([
        Bill.find({ residentId: userId, status: { $in: ["Pending", "Overdue"] } }).sort("-dueDate"),
        Complaint.find({ residentId: userId, status: { $nin: ["Closed", "Resolved"] } }).sort("-createdAt").limit(5),
        Booking.find({ residentId: userId, bookingDate: { $gte: new Date() }, status: { $in: ["Pending", "Approved"] } })
            .populate("facilityId", "facilityName").sort("bookingDate").limit(5),
        Notice.find({ $or: [{ expiryDate: { $gte: new Date() } }, { expiryDate: null }] }).sort("-createdAt").limit(3),
        Notification.countDocuments({ userId, isRead: false }),
    ]);

    res.status(200).json(new ApiResponse(200, {
        profile: { name: req.user.name, flatId: req.user.flatId },
        pendingBills,
        activeComplaints,
        upcomingBookings,
        recentNotices,
        unreadNotifications,
    }, "Resident dashboard data."));
});

// GET /api/v1/dashboard/security
const securityDashboard = asyncHandler(async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        currentlyInside,
        pendingApprovals,
        expectedDeliveries,
        todayEntries,
        todayExits,
        recentVisitors,
    ] = await Promise.all([
        Visitor.countDocuments({ entryTime: { $ne: null }, exitTime: null }),
        Visitor.countDocuments({ approvalStatus: "Pending" }),
        Visitor.countDocuments({ visitorType: "delivery", createdAt: { $gte: today, $lt: tomorrow } }),
        Visitor.countDocuments({ entryTime: { $gte: today, $lt: tomorrow } }),
        Visitor.countDocuments({ exitTime: { $gte: today, $lt: tomorrow } }),
        Visitor.find({ createdAt: { $gte: today, $lt: tomorrow } })
            .populate("residentId", "name flatId")
            .sort("-createdAt").limit(20),
    ]);

    res.status(200).json(new ApiResponse(200, {
        currentlyInside,
        pendingApprovals,
        expectedDeliveries,
        todayEntries,
        todayExits,
        recentVisitors,
    }, "Security dashboard data."));
});

// GET /api/v1/dashboard/maintenance
const maintenanceDashboard = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
        assignedCount,
        inProgressCount,
        resolvedToday,
        totalResolved,
        assignedComplaints,
    ] = await Promise.all([
        Complaint.countDocuments({ assignedTo: userId, status: { $in: ["Assigned", "In Progress"] } }),
        Complaint.countDocuments({ assignedTo: userId, status: "In Progress" }),
        Complaint.countDocuments({ assignedTo: userId, status: "Resolved", updatedAt: { $gte: today, $lt: tomorrow } }),
        Complaint.countDocuments({ assignedTo: userId, status: { $in: ["Resolved", "Closed"] } }),
        Complaint.find({ assignedTo: userId, status: { $in: ["Assigned", "In Progress"] } })
            .populate({
                path: "residentId",
                select: "name phone",
                populate: { path: "flatId", select: "block flatNumber" }
            })
            .sort("-createdAt"),
    ]);

    const totalAssigned = await Complaint.countDocuments({ assignedTo: userId });
    const completionRate = totalAssigned > 0 ? Math.round((totalResolved / totalAssigned) * 100) : 0;

    res.status(200).json(new ApiResponse(200, {
        assignedCount,
        inProgressCount,
        resolvedToday,
        assignedComplaints,
        completionRate,
    }, "Maintenance dashboard data."));
});

module.exports = { adminDashboard, residentDashboard, securityDashboard, maintenanceDashboard };
