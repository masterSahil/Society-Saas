const Bill = require("../model/billSchema");
const User = require("../model/userSchema");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/apiResponse");
const ApiError = require("../utils/apiError");
const { buildPagination, paginationMeta } = require("../utils/paginationHelper");
const { createNotification } = require("../services/notificationService");

// GET /api/v1/bills
const getBills = asyncHandler(async (req, res) => {
    const { status, month, year } = req.query;
    const { skip, limit, sort, page } = buildPagination(req.query);

    const filter = {};
    if (req.user.role === "resident") filter.residentId = req.user._id;
    if (status) filter.status = status;
    if (month) filter.month = month;
    if (year) filter.year = parseInt(year, 10);

    const [bills, total] = await Promise.all([
        Bill.find(filter).populate("residentId", "name email flatId").skip(skip).limit(limit).sort(sort),
        Bill.countDocuments(filter),
    ]);

    res.status(200).json(new ApiResponse(200, { bills, pagination: paginationMeta(total, page, limit) }, "Bills fetched."));
});

// GET /api/v1/bills/:id
const getBillById = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id).populate("residentId", "name email flatId");
    if (!bill) throw new ApiError(404, "Bill not found.");

    if (req.user.role === "resident" && bill.residentId._id.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "Access denied.");
    }

    res.status(200).json(new ApiResponse(200, { bill }, "Bill fetched."));
});

// POST /api/v1/bills
const createBill = asyncHandler(async (req, res) => {
    const { residentId, month, year, amount, dueDate } = req.body;

    const bill = await Bill.create({ residentId, month, year, amount, dueDate });

    await createNotification(residentId, "New Bill", `Your maintenance bill for ${month} ${year} of ₹${amount} is due.`);

    res.status(201).json(new ApiResponse(201, { bill }, "Bill created."));
});

// PUT /api/v1/bills/:id
const updateBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findByIdAndUpdate(req.params.id, { $set: req.body }, { returnDocument: 'after', runValidators: true });
    if (!bill) throw new ApiError(404, "Bill not found.");
    res.status(200).json(new ApiResponse(200, { bill }, "Bill updated."));
});

// PUT /api/v1/bills/:id/pay
const payBill = asyncHandler(async (req, res) => {
    const bill = await Bill.findById(req.params.id);
    if (!bill) throw new ApiError(404, "Bill not found.");

    if (bill.residentId.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only pay your own bills.");
    }
    if (bill.status === "Paid") throw new ApiError(400, "Bill is already paid.");

    bill.status = "Paid";
    await bill.save();

    res.status(200).json(new ApiResponse(200, { bill }, "Bill paid successfully."));
});

// POST /api/v1/bills/generate
const generateBills = asyncHandler(async (req, res) => {
    const { month, year, amount, dueDate } = req.body;

    const residents = await User.find({ role: "resident", isActive: true }).select("_id");

    if (residents.length === 0) {
        throw new ApiError(400, "No active residents found.");
    }

    const bills = residents.map((r) => ({
        residentId: r._id,
        month,
        year,
        amount,
        dueDate,
    }));

    const created = await Bill.insertMany(bills);

    // Notify all residents
    for (const r of residents) {
        await createNotification(r._id, "New Bill Generated", `Your maintenance bill for ${month} ${year} of ₹${amount} is due.`);
    }

    res.status(201).json(new ApiResponse(201, { bills: created, count: created.length }, `${created.length} bills generated.`));
});

module.exports = { getBills, getBillById, createBill, updateBill, payBill, generateBills };
