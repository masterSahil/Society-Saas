const jwt = require("jsonwebtoken");
const User = require("../model/userSchema");
const ApiError = require("../utils/apiError");
const asyncHandler = require("../utils/asyncHandler");

/**
 * Verifies the JWT from the Authorization header and attaches the
 * full user document (minus password) to req.user.
 */
const authenticate = asyncHandler(async (req, _res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Access denied. No token provided.");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            throw new ApiError(401, "User associated with this token no longer exists.");
        }

        if (!user.isActive) {
            throw new ApiError(403, "Your account has been deactivated. Contact admin.");
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof ApiError) throw error;
        throw new ApiError(401, "Invalid or expired token.");
    }
});

module.exports = authenticate;
