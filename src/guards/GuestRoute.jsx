"use client";
import { Navigate } from '@/lib/react-router-dom';
import { useAuth } from "../context/AuthContext";

/**
 * Wraps guest-only routes (login, register).
 * Redirects authenticated users to their dashboard.
 */
const GuestRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-stone-50">
                <div className="w-10 h-10 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default GuestRoute;
