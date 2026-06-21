const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { updateUserValidator } = require("../validators/userValidator");
const { getAllUsers, getUserById, updateUser, deleteUser, toggleActive } = require("../controllers/userController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.SECURITY), getAllUsers);
router.get("/:id", authorize(ROLES.ADMIN), getUserById);
router.put("/:id", authorize(ROLES.ADMIN), updateUserValidator, validate, updateUser);
router.delete("/:id", authorize(ROLES.ADMIN), deleteUser);
router.put("/:id/toggle-active", authorize(ROLES.ADMIN), toggleActive);

module.exports = router;
