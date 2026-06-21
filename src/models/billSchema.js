import mongoose from "mongoose";

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

const Bill = mongoose.models.Bill || mongoose.model("Bill", billSchema);
export default Bill;