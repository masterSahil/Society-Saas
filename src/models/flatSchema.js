import mongoose from "mongoose";

const flatSchema = new mongoose.Schema(
    {
        block: String,
        floor: Number,
        flatNumber: {
            type: String,
            required: true
        },
        flatType: {
            type: String,
            enum: ["1BHK", "2BHK", "3BHK", "4BHK"]
        },
        status: {
            type: String,
            enum: ["occupied", "vacant"],
            default: "vacant"
        }
    },
    { timestamps: true }
);

const Flat = mongoose.models.Flat || mongoose.model("Flat", flatSchema);
export default Flat;