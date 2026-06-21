import mongoose from "mongoose";

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

const Complaint = mongoose.models.Complaint || mongoose.model("Complaint", complainSchema);
export default Complaint;