const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { familyValidator, updateFamilyValidator } = require("../validators/familyValidator");
const { getFamily, getFamilyMember, addFamilyMember, updateFamilyMember, deleteFamilyMember } = require("../controllers/familyController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), getFamily);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), getFamilyMember);
router.post("/", authorize(ROLES.RESIDENT), familyValidator, validate, addFamilyMember);
router.put("/:id", authorize(ROLES.RESIDENT), updateFamilyValidator, validate, updateFamilyMember);
router.delete("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), deleteFamilyMember);

module.exports = router;
