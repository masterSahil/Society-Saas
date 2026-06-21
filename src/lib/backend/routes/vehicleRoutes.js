const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { vehicleValidator, updateVehicleValidator } = require("../validators/vehicleValidator");
const { getVehicles, addVehicle, updateVehicle, deleteVehicle } = require("../controllers/vehicleController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT, ROLES.SECURITY), getVehicles);
router.post("/", authorize(ROLES.RESIDENT), vehicleValidator, validate, addVehicle);
router.put("/:id", authorize(ROLES.RESIDENT), updateVehicleValidator, validate, updateVehicle);
router.delete("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), deleteVehicle);

module.exports = router;
