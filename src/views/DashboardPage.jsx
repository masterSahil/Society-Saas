import { useAuth } from "../context/AuthContext";
import AdminDashboard from "../components/dashboard/Admin";
import ResidentDashboard from "../components/dashboard/Resident";
import SecurityDashboard from "../components/dashboard/Security";
import MaintenanceDashboard from "../components/dashboard/MaintainanceStaff";

/**
 * Renders the correct dashboard component based on the user's role.
 */
const DashboardPage = () => {
    const { user } = useAuth();

    switch (user?.role) {
        case "admin":
            return <AdminDashboard />;
        case "resident":
            return <ResidentDashboard />;
        case "security":
            return <SecurityDashboard />;
        case "maintenance":
            return <MaintenanceDashboard />;
        default:
            return <AdminDashboard />;
    }
};

export default DashboardPage;
