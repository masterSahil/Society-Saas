const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        vehicleNumber: String,
        vehicleType: String,
        brand: String,
        color: String
    },
    { timestamps: true }
);

module.exports = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);