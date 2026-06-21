const Poll = require("../model/pollSchema");
const Vote = require("../model/voteSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");
const { broadcastNotification } = require("../services/notificationService");

// GET /api/v1/polls
const getPolls = asyncHandler(async (req, res) => {
    const { isActive } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (isActive !== undefined) filter.isActive = isActive === "true";

    const [polls, total] = await Promise.all([
        Poll.find(filter).skip(skip).limit(limit).sort(sort),
        Poll.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { polls, pagination: paginationMeta(total, page, limit) }, "Polls fetched."));
});

// GET /api/v1/polls/:id
const getPollById = asyncHandler(async (req, res) => {
    const poll = await Poll.findById(req.params.id);
    if (!poll) throw new ApiError(404, "Poll not found.");

    // Check if user has voted
    const userVote = await Vote.findOne({ pollId: poll._id, residentId: req.user._id });

    // Get results
    const votes = await Vote.find({ pollId: poll._id });
    const resultsMap = {};
    poll.options.forEach((opt) => { resultsMap[opt] = 0; });
    votes.forEach((v) => { if (resultsMap[v.selectedOption] !== undefined) resultsMap[v.selectedOption]++; });

    const results = Object.keys(resultsMap).map(key => ({
        option: key,
        count: resultsMap[key]
    }));

    res.status(200).json(new ApiResponse(200, {
        poll,
        userVote: userVote?.selectedOption || null,
        results,
        totalVotes: votes.length,
    }, "Poll fetched."));
});

// POST /api/v1/polls
const createPoll = asyncHandler(async (req, res) => {
    const { question, options, startDate, endDate } = req.body;

    const poll = await Poll.create({
        question,
        options,
        startDate: startDate || new Date(),
        endDate,
    });

    await broadcastNotification("New Poll", question);

    res.status(201).json(new ApiResponse(201, { poll }, "Poll created."));
});

// POST /api/v1/polls/:id/vote
const castVote = asyncHandler(async (req, res) => {
    const { selectedOption } = req.body;

    const poll = await Poll.findById(req.params.id);
    if (!poll) throw new ApiError(404, "Poll not found.");
    if (!poll.isActive) throw new ApiError(400, "This poll is no longer active.");
    if (new Date() > new Date(poll.endDate)) throw new ApiError(400, "This poll has ended.");
    if (!poll.options.includes(selectedOption)) throw new ApiError(400, "Invalid option selected.");

    // Check if already voted
    const existing = await Vote.findOne({ pollId: poll._id, residentId: req.user._id });
    if (existing) throw new ApiError(400, "You have already voted in this poll.");

    const vote = await Vote.create({
        pollId: poll._id,
        residentId: req.user._id,
        selectedOption,
    });

    res.status(201).json(new ApiResponse(201, { vote }, "Vote cast successfully."));
});

// GET /api/v1/polls/:id/results
const getPollResults = asyncHandler(async (req, res) => {
    const poll = await Poll.findById(req.params.id);
    if (!poll) throw new ApiError(404, "Poll not found.");

    const votes = await Vote.find({ pollId: poll._id });
    const resultsMap = {};
    poll.options.forEach((opt) => { resultsMap[opt] = 0; });
    votes.forEach((v) => { if (resultsMap[v.selectedOption] !== undefined) resultsMap[v.selectedOption]++; });

    const results = Object.keys(resultsMap).map(key => ({
        option: key,
        count: resultsMap[key]
    }));

    res.status(200).json(new ApiResponse(200, {
        poll,
        results,
        totalVotes: votes.length,
    }, "Results fetched."));
});

module.exports = { getPolls, getPollById, createPoll, castVote, getPollResults };
