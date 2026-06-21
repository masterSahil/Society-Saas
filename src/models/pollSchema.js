import mongoose from "mongoose";

const pollSchema = new mongoose.Schema(
    {
        question: String,
        options: [String],
        startDate: Date,
        endDate: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

const Poll = mongoose.models.Poll || mongoose.model("Poll", pollSchema);
export default Poll;