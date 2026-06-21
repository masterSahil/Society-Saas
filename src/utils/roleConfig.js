import {
    LayoutDashboard,
    Users,
    Building2,
    UserPlus,
    Car,
    DoorOpen,
    AlertTriangle,
    Receipt,
    Landmark,
    CalendarCheck,
    Megaphone,
    BarChart3,
    Bell,
    Wrench,
    Settings,
} from "lucide-react";

/**
 * Sidebar menu configuration per role.
 * Each item: { label, path, icon, roles[] }
 *
 * Only items whose `roles` array includes the current user's role will render.
 */
const menuItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        roles: ["admin", "resident", "security", "maintenance"],
    },
    {
        label: "Manage Residents",
        path: "/residents",
        icon: Users,
        roles: ["admin"],
    },
    {
        label: "Manage Flats",
        path: "/flats",
        icon: Building2,
        roles: ["admin"],
    },
    {
        label: "My Family",
        path: "/family",
        icon: UserPlus,
        roles: ["resident"],
    },
    {
        label: "My Vehicles",
        path: "/vehicles",
        icon: Car,
        roles: ["resident"],
    },
    {
        label: "Visitors",
        path: "/visitors",
        icon: DoorOpen,
        roles: ["admin", "resident", "security"],
    },
    {
        label: "Complaints",
        path: "/complaints",
        icon: AlertTriangle,
        roles: ["admin", "resident"],
    },
    {
        label: "Billing",
        path: "/bills",
        icon: Receipt,
        roles: ["admin", "resident"],
    },
    {
        label: "Facilities",
        path: "/facilities",
        icon: Landmark,
        roles: ["admin", "resident"],
    },
    {
        label: "My Bookings",
        path: "/bookings",
        icon: CalendarCheck,
        roles: ["resident"],
    },
    {
        label: "Notices",
        path: "/notices",
        icon: Megaphone,
        roles: ["admin", "resident", "security", "maintenance"],
    },
    {
        label: "Polls & Voting",
        path: "/polls",
        icon: BarChart3,
        roles: ["admin", "resident"],
    },
    {
        label: "Work Orders",
        path: "/work-orders",
        icon: Wrench,
        roles: ["maintenance"],
    },
    {
        label: "Notifications",
        path: "/notifications",
        icon: Bell,
        roles: ["admin", "resident", "security", "maintenance"],
    },
    {
        label: "My Profile",
        path: "/profile",
        icon: Settings,
        roles: ["admin"],
    },
];

/**
 * Returns menu items filtered for a given user role.
 */
export const getMenuForRole = (role) => {
    return menuItems.filter((item) => item.roles.includes(role));
};

/**
 * Returns the role display label.
 */
export const getRoleLabel = (role) => {
    const labels = {
        admin: "Administrator",
        resident: "Resident",
        security: "Security Guard",
        maintenance: "Maintenance Staff",
    };
    return labels[role] || role;
};

export default menuItems;
