const { validationResult } = require("express-validator");
const ApiError = require("../utils/apiError");

/**
 * Middleware that checks express-validator results.
 * Must be placed AFTER the validator array in the route chain.
 */
const validate = (req, _res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const messages = errors.array().map((e) => e.msg);
        throw new ApiError(400, "Validation failed.", messages);
    }

    next();
};

module.exports = validate;
