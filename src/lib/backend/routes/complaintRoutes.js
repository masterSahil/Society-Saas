const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { ROLES } = require("../utils/constants");
const { createComplaintValidator, updateComplaintValidator, assignComplaintValidator, updateStatusValidator } = require("../validators/complaintValidator");
const { getComplaints, getComplaintById, createComplaint, updateComplaint, assignComplaint, updateStatus } = require("../controllers/complaintController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT, ROLES.MAINTENANCE), getComplaints);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT, ROLES.MAINTENANCE), getComplaintById);
router.post("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), upload.single("image"), createComplaintValidator, validate, createComplaint);
router.put("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), upload.single("image"), updateComplaintValidator, validate, updateComplaint);
router.put("/:id/assign", authorize(ROLES.ADMIN), assignComplaintValidator, validate, assignComplaint);
router.put("/:id/status", authorize(ROLES.ADMIN, ROLES.MAINTENANCE), updateStatusValidator, validate, updateStatus);

module.exports = router;
