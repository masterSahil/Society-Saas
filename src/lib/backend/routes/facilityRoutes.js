const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { facilityValidator, updateFacilityValidator } = require("../validators/facilityValidator");
const { getFacilities, getFacilityById, createFacility, updateFacility, deleteFacility } = require("../controllers/facilityController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), getFacilities);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), getFacilityById);
router.post("/", authorize(ROLES.ADMIN), facilityValidator, validate, createFacility);
router.put("/:id", authorize(ROLES.ADMIN), updateFacilityValidator, validate, updateFacility);
router.delete("/:id", authorize(ROLES.ADMIN), deleteFacility);

module.exports = router;
