"use client";
import { Navigate } from '@/lib/react-router-dom';
import { useAuth } from "../context/AuthContext";

/**
 * Wraps routes that require specific role(s).
 * Must be nested inside a ProtectedRoute.
 *
 * Usage:
 *   <RoleRoute allowedRoles={["admin"]}>
 *     <AdminPage />
 *   </RoleRoute>
 */
const RoleRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;
