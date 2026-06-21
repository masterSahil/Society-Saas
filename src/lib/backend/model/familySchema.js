const mongoose = require("mongoose");

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

module.exports = mongoose.models.Family || mongoose.model("Family", familySchema);