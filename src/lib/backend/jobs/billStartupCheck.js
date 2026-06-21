const Bill = require("../model/billSchema");

const runBillStartupCheck = async () => {
    try {
        console.log("[STARTUP] Running check for overdue bills...");
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const result = await Bill.updateMany(
            { status: "Pending", dueDate: { $lt: today } },
            { $set: { status: "Overdue" } }
        );

        console.log(`[STARTUP] Overdue bill check complete. Updated ${result.modifiedCount} bills to Overdue.`);
    } catch (error) {
        console.error("[STARTUP] Error checking for overdue bills:", error);
    }
};

module.exports = runBillStartupCheck;
