import mongoose from "mongoose";

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

const Vote = mongoose.models.Vote || mongoose.model("Vote", voteSchema);
export default Vote;