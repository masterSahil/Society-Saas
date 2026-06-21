const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { createVisitorValidator, approveVisitorValidator } = require("../validators/visitorValidator");
const { getVisitors, getVisitorById, createVisitor, approveVisitor, markEntry, markExit } = require("../controllers/visitorController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT, ROLES.SECURITY), getVisitors);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT, ROLES.SECURITY), getVisitorById);
router.post("/", authorize(ROLES.RESIDENT, ROLES.SECURITY), createVisitorValidator, validate, createVisitor);
router.put("/:id/approve", authorize(ROLES.RESIDENT, ROLES.ADMIN), approveVisitorValidator, validate, approveVisitor);
router.put("/:id/entry", authorize(ROLES.SECURITY, ROLES.ADMIN), markEntry);
router.put("/:id/exit", authorize(ROLES.SECURITY, ROLES.ADMIN), markExit);

module.exports = router;
