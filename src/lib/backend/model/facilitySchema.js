const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema(
    {
        facilityName: String,
        description: String,
        capacity: Number,
        openingTime: String,
        closingTime: String,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Facility || mongoose.model("Facility", facilitySchema);