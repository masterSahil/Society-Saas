const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { noticeValidator, updateNoticeValidator } = require("../validators/noticeValidator");
const { getNotices, getNoticeById, createNotice, updateNotice, deleteNotice } = require("../controllers/noticeController");

router.use(authenticate);

router.get("/", getNotices);
router.get("/:id", getNoticeById);
router.post("/", authorize(ROLES.ADMIN), noticeValidator, validate, createNotice);
router.put("/:id", authorize(ROLES.ADMIN), updateNoticeValidator, validate, updateNotice);
router.delete("/:id", authorize(ROLES.ADMIN), deleteNotice);

module.exports = router;
