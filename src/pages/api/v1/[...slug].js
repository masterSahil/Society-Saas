import express from 'express';
import cors from 'cors';
import path from 'path';
import connectDB from '../../../lib/backend/config/db';
import errorMiddleware from '../../../lib/backend/middleware/errorMiddleware';

// ── Route Imports ──────────────────────────────────────────────
import authRoutes from '../../../lib/backend/routes/authRoutes';
import userRoutes from '../../../lib/backend/routes/userRoutes';
import flatRoutes from '../../../lib/backend/routes/flatRoutes';
import familyRoutes from '../../../lib/backend/routes/familyRoutes';
import vehicleRoutes from '../../../lib/backend/routes/vehicleRoutes';
import visitorRoutes from '../../../lib/backend/routes/visitorRoutes';
import complaintRoutes from '../../../lib/backend/routes/complaintRoutes';
import billRoutes from '../../../lib/backend/routes/billRoutes';
import facilityRoutes from '../../../lib/backend/routes/facilityRoutes';
import bookingRoutes from '../../../lib/backend/routes/bookingRoutes';
import noticeRoutes from '../../../lib/backend/routes/noticeRoutes';
import pollRoutes from '../../../lib/backend/routes/pollRoutes';
import notificationRoutes from '../../../lib/backend/routes/notificationRoutes';
import dashboardRoutes from '../../../lib/backend/routes/dashboardRoutes';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use(errorMiddleware);

// Next.js API route configuration
export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

// Connect to DB once
let isConnected = false;

export default async function handler(req, res) {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
  }
  return app(req, res);
}
