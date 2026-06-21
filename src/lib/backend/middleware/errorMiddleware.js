const ApiError = require("../utils/apiError");

/**
 * Global error-handling middleware.
 * Must be registered LAST in the Express middleware chain.
 *
 * Handles:
 *  - Custom ApiError instances
 *  - Mongoose ValidationError
 *  - Mongoose CastError (bad ObjectId)
 *  - Mongoose duplicate key (code 11000)
 *  - Unexpected / generic errors
 */
// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, _req, res, _next) => {
    let error = err;

    // ── Mongoose Validation Error ──────────────────────────────
    if (err.name === "ValidationError") {
        const messages = Object.values(err.errors).map((e) => e.message);
        error = new ApiError(400, "Validation Error", messages);
    }

    // ── Mongoose CastError (invalid ObjectId, etc.) ────────────
    if (err.name === "CastError") {
        error = new ApiError(400, `Invalid ${err.path}: ${err.value}`);
    }

    // ── Mongoose Duplicate Key ─────────────────────────────────
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue).join(", ");
        error = new ApiError(409, `Duplicate value for field: ${field}`);
    }

    // ── JWT Errors ─────────────────────────────────────────────
    if (err.name === "JsonWebTokenError") {
        error = new ApiError(401, "Invalid token.");
    }
    if (err.name === "TokenExpiredError") {
        error = new ApiError(401, "Token has expired.");
    }

    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        errors: error.errors || [],
        ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
    });
};

module.exports = errorMiddleware;
