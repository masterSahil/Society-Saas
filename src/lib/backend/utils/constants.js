/**
 * Centralised enums that mirror Mongoose schema definitions.
 * Import from here instead of hard-coding strings in controllers.
 */

const ROLES = Object.freeze({
    ADMIN: "admin",
    RESIDENT: "resident",
    SECURITY: "security",
    MAINTENANCE: "maintenance",
});

const ALL_ROLES = Object.values(ROLES);

const COMPLAINT_STATUS = Object.freeze({
    OPEN: "Open",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
});

const COMPLAINT_CATEGORIES = Object.freeze([
    "Electrical",
    "Plumbing",
    "Water",
    "Cleaning",
    "Security",
    "Parking",
    "Lift",
]);

const BILL_STATUS = Object.freeze({
    PAID: "Paid",
    PENDING: "Pending",
    OVERDUE: "Overdue",
});

const FLAT_TYPES = Object.freeze(["1BHK", "2BHK", "3BHK", "4BHK"]);

const FLAT_STATUS = Object.freeze({
    OCCUPIED: "occupied",
    VACANT: "vacant",
});

const VISITOR_TYPES = Object.freeze(["guest", "delivery"]);

const APPROVAL_STATUS = Object.freeze({
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
});

const BOOKING_STATUS = Object.freeze({
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
});

module.exports = {
    ROLES,
    ALL_ROLES,
    COMPLAINT_STATUS,
    COMPLAINT_CATEGORIES,
    BILL_STATUS,
    FLAT_TYPES,
    FLAT_STATUS,
    VISITOR_TYPES,
    APPROVAL_STATUS,
    BOOKING_STATUS,
};
