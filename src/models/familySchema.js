import mongoose from "mongoose";

const familySchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        relation: String,
        age: Number,
        phone: String
    },
    { timestamps: true }
);

const Family = mongoose.models.Family || mongoose.model("Family", familySchema);
export default Family;