import { Route, Routes } from "react-router-dom";
import GuestRoute from "./guards/GuestRoute";
import ProtectedRoute from "./guards/ProtectedRoute";
import DashboardLayout from "./layouts/DashboardLayout";
import AuthPage from "./components/AuthForm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import DashboardPage from "./pages/DashboardPage";
import Profile from "./pages/profile/Profile";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";

import ResidentList from "./pages/residents/ResidentList";
import ResidentFormPage from "./pages/residents/ResidentFormPage";
import FlatList from "./pages/flats/FlatList";
import FlatFormPage from "./pages/flats/FlatFormPage";
import ComplaintList from "./pages/complaints/ComplaintList";
import ComplaintFormPage from "./pages/complaints/ComplaintFormPage";
import VisitorList from "./pages/visitors/VisitorList";
import VisitorFormPage from "./pages/visitors/VisitorFormPage";
import FamilyList from "./pages/family/FamilyList";
import FamilyFormPage from "./pages/family/FamilyFormPage";
import VehicleList from "./pages/vehicles/VehicleList";
import VehicleFormPage from "./pages/vehicles/VehicleFormPage";
import BillList from "./pages/bills/BillList";
import BillFormPage from "./pages/bills/BillFormPage";
import FacilityList from "./pages/facilities/FacilityList";
import FacilityFormPage from "./pages/facilities/FacilityFormPage";
import BookingList from "./pages/bookings/BookingList";
import BookingFormPage from "./pages/bookings/BookingFormPage";
import NoticeList from "./pages/notices/NoticeList";
import NoticeFormPage from "./pages/notices/NoticeFormPage";
import PollList from "./pages/polls/PollList";
import PollFormPage from "./pages/polls/PollFormPage";
import NotificationList from "./pages/notifications/NotificationList";
import RoleRoute from "./guards/RoleRoute";

const MainRoutes = () => {
    return (
        <Routes>
            {/* Guest-only route (login/register) */}
            <Route
                path="/"
                element={
                    <GuestRoute>
                        <AuthPage />
                    </GuestRoute>
                }
            />

            <Route
                path="/forgot-password"
                element={
                    <GuestRoute>
                        <ForgotPassword />
                    </GuestRoute>
                }
            />

            {/* Protected routes inside dashboard layout */}
            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                {/* Dashboard — role-based rendering */}
                <Route path="/dashboard" element={<DashboardPage />} />

                {/* Profile */}
                <Route path="/profile" element={<Profile />} />

                {/* Unauthorized */}
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Phase 2 routes */}
                <Route path="/residents" element={<RoleRoute allowedRoles={["admin"]}><ResidentList /></RoleRoute>} />
                <Route path="/residents/new" element={<RoleRoute allowedRoles={["admin"]}><ResidentFormPage /></RoleRoute>} />
                <Route path="/residents/edit/:id" element={<RoleRoute allowedRoles={["admin"]}><ResidentFormPage /></RoleRoute>} />
                <Route path="/flats" element={<RoleRoute allowedRoles={["admin"]}><FlatList /></RoleRoute>} />
                <Route path="/flats/new" element={<RoleRoute allowedRoles={["admin"]}><FlatFormPage /></RoleRoute>} />
                <Route path="/flats/edit/:id" element={<RoleRoute allowedRoles={["admin"]}><FlatFormPage /></RoleRoute>} />
                <Route path="/complaints" element={<RoleRoute allowedRoles={["admin", "resident", "maintenance"]}><ComplaintList /></RoleRoute>} />
                <Route path="/complaints/new" element={<RoleRoute allowedRoles={["admin", "resident"]}><ComplaintFormPage /></RoleRoute>} />
                <Route path="/complaints/edit/:id" element={<RoleRoute allowedRoles={["admin", "resident"]}><ComplaintFormPage /></RoleRoute>} />
                <Route path="/work-orders" element={<RoleRoute allowedRoles={["admin", "resident", "maintenance"]}><ComplaintList /></RoleRoute>} />
                <Route path="/visitors" element={<RoleRoute allowedRoles={["admin", "resident", "security"]}><VisitorList /></RoleRoute>} />
                <Route path="/visitors/new" element={<RoleRoute allowedRoles={["admin", "resident", "security"]}><VisitorFormPage /></RoleRoute>} />
                <Route path="/visitors/edit/:id" element={<RoleRoute allowedRoles={["admin", "resident", "security"]}><VisitorFormPage /></RoleRoute>} />
                <Route path="/family" element={<RoleRoute allowedRoles={["admin", "resident"]}><FamilyList /></RoleRoute>} />
                <Route path="/family/new" element={<RoleRoute allowedRoles={["admin", "resident"]}><FamilyFormPage /></RoleRoute>} />
                <Route path="/family/edit/:id" element={<RoleRoute allowedRoles={["admin", "resident"]}><FamilyFormPage /></RoleRoute>} />
                <Route path="/vehicles" element={<RoleRoute allowedRoles={["admin", "resident", "security"]}><VehicleList /></RoleRoute>} />
                <Route path="/vehicles/new" element={<RoleRoute allowedRoles={["admin", "resident", "security"]}><VehicleFormPage /></RoleRoute>} />
                <Route path="/vehicles/edit/:id" element={<RoleRoute allowedRoles={["admin", "resident", "security"]}><VehicleFormPage /></RoleRoute>} />
                <Route path="/bills" element={<RoleRoute allowedRoles={["admin", "resident"]}><BillList /></RoleRoute>} />
                <Route path="/bills/new" element={<RoleRoute allowedRoles={["admin"]}><BillFormPage /></RoleRoute>} />
                <Route path="/bills/edit/:id" element={<RoleRoute allowedRoles={["admin"]}><BillFormPage /></RoleRoute>} />
                <Route path="/facilities" element={<RoleRoute allowedRoles={["admin", "resident"]}><FacilityList /></RoleRoute>} />
                <Route path="/facilities/new" element={<RoleRoute allowedRoles={["admin"]}><FacilityFormPage /></RoleRoute>} />
                <Route path="/facilities/edit/:id" element={<RoleRoute allowedRoles={["admin"]}><FacilityFormPage /></RoleRoute>} />
                <Route path="/bookings" element={<RoleRoute allowedRoles={["admin", "resident"]}><BookingList /></RoleRoute>} />
                <Route path="/bookings/new" element={<RoleRoute allowedRoles={["resident"]}><BookingFormPage /></RoleRoute>} />
                <Route path="/notices" element={<NoticeList />} />
                <Route path="/notices/new" element={<RoleRoute allowedRoles={["admin"]}><NoticeFormPage /></RoleRoute>} />
                <Route path="/notices/edit/:id" element={<RoleRoute allowedRoles={["admin"]}><NoticeFormPage /></RoleRoute>} />
                <Route path="/polls" element={<RoleRoute allowedRoles={["admin", "resident"]}><PollList /></RoleRoute>} />
                <Route path="/polls/new" element={<RoleRoute allowedRoles={["admin"]}><PollFormPage /></RoleRoute>} />
                <Route path="/notifications" element={<NotificationList />} />

                {/* 
                    Remaining routes to be added here:
                    <Route path="/settings" element={<RoleRoute allowedRoles={["admin"]}><Settings /></RoleRoute>} />
                */}
            </Route>

            {/* 404 catch-all */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default MainRoutes;