const { body } = require("express-validator");

const vehicleValidator = [
    body("vehicleNumber").trim().notEmpty().withMessage("Vehicle number is required."),
    body("vehicleType").optional().trim(),
    body("brand").optional().trim(),
    body("color").optional().trim(),
];

const updateVehicleValidator = [
    body("vehicleNumber").optional().trim().notEmpty().withMessage("Vehicle number cannot be empty."),
    body("vehicleType").optional().trim(),
    body("brand").optional().trim(),
    body("color").optional().trim(),
];

module.exports = { vehicleValidator, updateVehicleValidator };
