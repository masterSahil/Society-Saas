const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        phone: String,
        role: {
            type: String,
            enum: ["admin", "resident", "security", "maintenance"],
            default: "resident"
        },
        flatId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flat"
        },
        profileImage: String,
        resetPasswordOtp: String,
        resetPasswordOtpExpires: Date,
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);