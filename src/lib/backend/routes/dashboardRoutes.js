const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const { ROLES } = require("../utils/constants");
const { adminDashboard, residentDashboard, securityDashboard, maintenanceDashboard } = require("../controllers/dashboardController");

router.use(authenticate);

router.get("/admin", authorize(ROLES.ADMIN), adminDashboard);
router.get("/resident", authorize(ROLES.RESIDENT), residentDashboard);
router.get("/security", authorize(ROLES.SECURITY), securityDashboard);
router.get("/maintenance", authorize(ROLES.MAINTENANCE), maintenanceDashboard);

module.exports = router;
