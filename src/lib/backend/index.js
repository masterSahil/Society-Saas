require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

// ── Route Imports ──────────────────────────────────────────────
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const flatRoutes = require("./routes/flatRoutes");
const familyRoutes = require("./routes/familyRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const visitorRoutes = require("./routes/visitorRoutes");
const complaintRoutes = require("./routes/complaintRoutes");
const billRoutes = require("./routes/billRoutes");
const facilityRoutes = require("./routes/facilityRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const noticeRoutes = require("./routes/noticeRoutes");
const pollRoutes = require("./routes/pollRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// ── Express App ────────────────────────────────────────────────
const app = express();

// ── Global Middleware ──────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ── Health Check ───────────────────────────────────────────────
app.get("/api/v1/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// ── API Routes (v1) ───────────────────────────────────────────
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/flats", flatRoutes);
app.use("/api/v1/family", familyRoutes);
app.use("/api/v1/vehicles", vehicleRoutes);
app.use("/api/v1/visitors", visitorRoutes);
app.use("/api/v1/complaints", complaintRoutes);
app.use("/api/v1/bills", billRoutes);
app.use("/api/v1/facilities", facilityRoutes);
app.use("/api/v1/bookings", bookingRoutes);
app.use("/api/v1/notices", noticeRoutes);
app.use("/api/v1/polls", pollRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

// ── Global Error Handler (must be last) ────────────────────────
app.use(errorMiddleware);

// ── Start Server ───────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const runBillStartupCheck = require("./jobs/billStartupCheck");

connectDB().then(() => {
    runBillStartupCheck(); // Start background jobs
    
    app.listen(PORT, () => {
        console.log(`✓ Server running on http://localhost:${PORT}`);
        console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
        console.log(`✓ API Base: http://localhost:${PORT}/api/v1`);
    });
});
