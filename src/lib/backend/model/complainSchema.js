const mongoose = require("mongoose");

const complainSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        category: {
            type: String,
            enum: [ "Electrical", "Plumbing", "Water", "Cleaning", "Security", "Parking", "Lift" ]
        },
        title: String,
        description: String,
        image: String,
        status: {
            type: String,
            enum: [ "Open", "Assigned", "In Progress", "Resolved", "Closed" ],
            default: "Open"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Complaint || mongoose.model("Complaint", complainSchema);