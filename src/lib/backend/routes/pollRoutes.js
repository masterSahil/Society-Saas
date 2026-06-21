const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { pollValidator, voteValidator } = require("../validators/pollValidator");
const { getPolls, getPollById, createPoll, castVote, getPollResults } = require("../controllers/pollController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), getPolls);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), getPollById);
router.post("/", authorize(ROLES.ADMIN), pollValidator, validate, createPoll);
router.post("/:id/vote", authorize(ROLES.RESIDENT), voteValidator, validate, castVote);
router.get("/:id/results", authorize(ROLES.ADMIN, ROLES.RESIDENT), getPollResults);

module.exports = router;
