const { body } = require("express-validator");
const { VISITOR_TYPES, APPROVAL_STATUS } = require("../utils/constants");

const createVisitorValidator = [
    body("visitorName").trim().notEmpty().withMessage("Visitor name is required."),
    body("mobile").trim().notEmpty().withMessage("Mobile number is required."),
    body("purpose").optional().trim(),
    body("visitorType").optional().isIn(VISITOR_TYPES).withMessage(`Visitor type must be one of: ${VISITOR_TYPES.join(", ")}`),
    body("residentId").optional().isMongoId().withMessage("Invalid resident ID."),
];

const approveVisitorValidator = [
    body("approvalStatus")
        .notEmpty().withMessage("Approval status is required.")
        .isIn([APPROVAL_STATUS.APPROVED, APPROVAL_STATUS.REJECTED])
        .withMessage("Status must be Approved or Rejected."),
];

module.exports = { createVisitorValidator, approveVisitorValidator };
