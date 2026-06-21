const ApiError = require("../utils/apiError");

/**
 * Factory middleware that restricts route access to specified roles.
 *
 * Usage in routes:
 *   router.get("/admin-only", authenticate, authorize("admin"), controller);
 *   router.get("/multi", authenticate, authorize("admin", "resident"), controller);
 *
 * @param  {...string} allowedRoles – one or more role strings
 */
const authorize = (...allowedRoles) => {
    return (req, _res, next) => {
        if (!req.user) {
            throw new ApiError(401, "Authentication required before authorization.");
        }

        if (!allowedRoles.includes(req.user.role)) {
            throw new ApiError(
                403,
                `Access denied. Role '${req.user.role}' is not authorized for this resource.`
            );
        }

        next();
    };
};

module.exports = authorize;
