const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        month: String,
        year: Number,
        amount: Number,
        dueDate: Date,
        status: {
            type: String,
            enum: ["Paid", "Pending", "Overdue"],
            default: "Pending"
        }
    },
    { timestamps: true }
);

module.exports = mongoose.models.Bill || mongoose.model("Bill", billSchema);