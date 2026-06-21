const User = require("../model/userSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { hashPassword, comparePassword, generateToken } = require("../services/authService");
const sendEmail = require("../services/emailService");

// POST /api/v1/auth/register   [Admin only]
const register = asyncHandler(async (req, res) => {
    const { name, email, password, phone, role, flatId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "A user with this email already exists.");
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword,
        phone,
        role: role || "resident",
        flatId: flatId || undefined,
    });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json(
        new ApiResponse(201, { user: userResponse }, "User registered successfully.")
    );
});

// ─────────────────────────────────────────────────────────────
// POST /api/v1/auth/login      [Public]
// ─────────────────────────────────────────────────────────────
const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Find user including password field
    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "Invalid email or password.");
    }

    // Check if user is active
    if (!user.isActive) {
        throw new ApiError(403, "Your account has been deactivated. Contact admin.");
    }

    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password.");
    }

    // Generate JWT
    const token = generateToken({ id: user._id, role: user.role });

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(200).json(
        new ApiResponse(200, { user: userResponse, token }, "Login successful.")
    );
});

// GET /api/v1/auth/profile     [Authenticated]
const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select("-password")
        .populate("flatId");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(
        new ApiResponse(200, { user }, "Profile fetched successfully.")
    );
});

// PUT /api/v1/auth/profile     [Authenticated]
const updateProfile = asyncHandler(async (req, res) => {
    const { name, phone } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;

    // Handle profile image upload
    if (req.file) {
        updateData.profileImage = req.file.path;
    }

    const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        { returnDocument: 'after', runValidators: true }
    ).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    res.status(200).json(
        new ApiResponse(200, { user }, "Profile updated successfully.")
    );
});

// ─────────────────────────────────────────────────────────────
// PUT /api/v1/auth/change-password   [Authenticated]
// ─────────────────────────────────────────────────────────────
const changePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new ApiError(404, "User not found.");
    }

    // Verify current password
    const isMatch = await comparePassword(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(400, "Current password is incorrect.");
    }

    // Prevent reuse of the same password
    if (currentPassword === newPassword) {
        throw new ApiError(400, "New password must differ from the current password.");
    }

    // Hash and save new password
    user.password = await hashPassword(newPassword);
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "Password changed successfully.")
    );
});

// ─────────────────────────────────────────────────────────────
// POST /api/v1/auth/forgot-password   [Public]
// ─────────────────────────────────────────────────────────────
const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        // Return 200 even if user not found to prevent email enumeration
        return res.status(200).json(
            new ApiResponse(200, null, "If that email exists, an OTP has been sent.")
        );
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes

    user.resetPasswordOtp = otp;
    user.resetPasswordOtpExpires = otpExpires;
    await user.save();

    // Log the OTP to console (fallback simulation)
    console.log(`\n=================================================`);
    console.log(`[Email Simulation] OTP for ${email}: ${otp}`);
    console.log(`=================================================\n`);

    try {
        const message = `Your password reset OTP is: ${otp}. It is valid for 2 minutes.\n\nIf you did not request this, please ignore this email.`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password. Here is your One-Time Password (OTP):</p>
                <h1 style="letter-spacing: 5px; color: #4F46E5;">${otp}</h1>
                <p>This OTP is valid for <strong>2 minutes</strong>.</p>
                <p>If you did not request a password reset, you can safely ignore this email.</p>
            </div>
        `;
        
        await sendEmail({
            email: user.email,
            subject: 'Password Reset OTP - Society Management',
            message,
            html,
        });
    } catch (err) {
        console.error("Email could not be sent:", err);
        // We still return 200, but log the error. 
        // In a strict prod app you might return a 500 error, but here we don't want to block them completely if SMTP fails.
    }

    res.status(200).json(
        new ApiResponse(200, { otp }, "If that email exists, an OTP has been sent.")
    );
});

// ─────────────────────────────────────────────────────────────
// POST /api/v1/auth/verify-otp   [Public]
// ─────────────────────────────────────────────────────────────
const verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid email or OTP.");
    }

    if (user.resetPasswordOtp !== otp) {
        throw new ApiError(400, "Invalid OTP.");
    }

    if (user.resetPasswordOtpExpires < new Date()) {
        throw new ApiError(400, "OTP has expired.");
    }

    // OTP is valid
    res.status(200).json(
        new ApiResponse(200, null, "OTP verified successfully. You can now reset your password.")
    );
});

// ─────────────────────────────────────────────────────────────
// POST /api/v1/auth/reset-password   [Public]
// ─────────────────────────────────────────────────────────────
const resetPassword = asyncHandler(async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(400, "Invalid email or OTP.");
    }

    if (user.resetPasswordOtp !== otp) {
        throw new ApiError(400, "Invalid OTP.");
    }

    if (user.resetPasswordOtpExpires < new Date()) {
        throw new ApiError(400, "OTP has expired.");
    }

    // Hash and save new password
    user.password = await hashPassword(newPassword);
    
    // Clear OTP fields
    user.resetPasswordOtp = undefined;
    user.resetPasswordOtpExpires = undefined;
    
    await user.save();

    res.status(200).json(
        new ApiResponse(200, null, "Password reset successfully. You can now log in.")
    );
});

module.exports = {
    register,
    login,
    getProfile,
    updateProfile,
    changePassword,
    forgotPassword,
    verifyOtp,
    resetPassword,
};
