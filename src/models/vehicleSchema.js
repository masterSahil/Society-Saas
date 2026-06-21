import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
    {
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        vehicleNumber: String,
        vehicleType: String,
        brand: String,
        color: String
    },
    { timestamps: true }
);

const Vehicle = mongoose.models.Vehicle || mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;