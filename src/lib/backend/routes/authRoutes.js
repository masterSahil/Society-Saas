const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const upload = require("../middleware/uploadMiddleware");
const { ROLES } = require("../utils/constants");

const {
    registerValidator,
    loginValidator,
    updateProfileValidator,
    changePasswordValidator,
    forgotPasswordValidator,
    verifyOtpValidator,
    resetPasswordValidator,
} = require("../validators/authValidator");

const {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
} = require("../controllers/authController");

// ── Public ─────────────────────────────────────────────────────
router.post("/login", loginValidator, validate, login);
router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);
router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);
router.post("/reset-password", resetPasswordValidator, validate, resetPassword);

// ── Public Registration (for testing/setup) ─────────────────────
router.post(
    "/register",
    registerValidator,
    validate,
    register
);

// ── Authenticated ──────────────────────────────────────────────
router.get("/profile", authenticate, getProfile);

router.put(
    "/profile",
    authenticate,
    upload.single("profileImage"),
    updateProfileValidator,
    validate,
    updateProfile
);

router.put("/change-password", authenticate, changePasswordValidator, validate, changePassword);

module.exports = router;
