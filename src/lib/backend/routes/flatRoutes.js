const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { createFlatValidator, updateFlatValidator, assignFlatValidator } = require("../validators/flatValidator");
const { getAllFlats, getFlatById, createFlat, updateFlat, deleteFlat, assignFlat } = require("../controllers/flatController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), getAllFlats);
router.get("/:id", authorize(ROLES.ADMIN), getFlatById);
router.post("/", authorize(ROLES.ADMIN), createFlatValidator, validate, createFlat);
router.put("/:id", authorize(ROLES.ADMIN), updateFlatValidator, validate, updateFlat);
router.delete("/:id", authorize(ROLES.ADMIN), deleteFlat);
router.put("/:id/assign", authorize(ROLES.ADMIN), assignFlatValidator, validate, assignFlat);

module.exports = router;
