const mongoose = require("mongoose");

const voteSchema = new mongoose.Schema(
    {
        pollId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Poll"
        },
        residentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        selectedOption: String
    },
    { timestamps: true }
);

module.exports = mongoose.models.Vote || mongoose.model("Vote", voteSchema);