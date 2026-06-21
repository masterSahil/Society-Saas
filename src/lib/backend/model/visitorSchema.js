const mongoose = require("mongoose");

const visitorSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        visitorName: String,
        mobile: String,
        purpose: String,
        visitorType: {
            type: String,
            enum: ["guest", "delivery"]
        },
        approvalStatus: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending"
        },
        entryTime: Date,
        exitTime: Date
    },
    { timestamps: true }
);

module.exports = mongoose.models.Visitor || mongoose.model("Visitor", visitorSchema);