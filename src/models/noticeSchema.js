import mongoose from "mongoose";

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

const Notice = mongoose.models.Notice || mongoose.model("Notice", noticeSchema);
export default Notice;