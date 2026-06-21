const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");
const validate = require("../middleware/validateMiddleware");
const { ROLES } = require("../utils/constants");
const { createBillValidator, updateBillValidator, generateBillsValidator } = require("../validators/billValidator");
const { getBills, getBillById, createBill, updateBill, payBill, generateBills } = require("../controllers/billController");

router.use(authenticate);

router.get("/", authorize(ROLES.ADMIN, ROLES.RESIDENT), getBills);
router.get("/:id", authorize(ROLES.ADMIN, ROLES.RESIDENT), getBillById);
router.post("/", authorize(ROLES.ADMIN), createBillValidator, validate, createBill);
router.post("/generate", authorize(ROLES.ADMIN), generateBillsValidator, validate, generateBills);
router.put("/:id", authorize(ROLES.ADMIN), updateBillValidator, validate, updateBill);
router.put("/:id/pay", authorize(ROLES.RESIDENT), payBill);

module.exports = router;
