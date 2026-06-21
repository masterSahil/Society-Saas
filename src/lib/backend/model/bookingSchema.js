const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        facilityId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Facility"
        },
        bookingDate: Date,
        startTime: String,
        endTime: String,
        status: {
            type: String,
            enum: [ "Pending", "Approved", "Rejected", "Cancelled" ],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);