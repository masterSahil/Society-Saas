const mongoose = require("mongoose");

const noticeSchema = new mongoose.Schema(
    {
        title: String,
        description: String,
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        expiryDate: Date
    },
    { timestamps: true }
);

module.exports = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);