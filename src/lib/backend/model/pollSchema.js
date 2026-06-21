const mongoose = require("mongoose");

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

module.exports = mongoose.models.Poll || mongoose.model("Poll", pollSchema);