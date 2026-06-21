import { useState, useEffect, useCallback } from "react";
import api from "../config/api";
import { useAuth } from "../context/AuthContext";

const useNotifications = () => {
    const { isAuthenticated } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchUnreadCount = useCallback(async () => {
        if (!isAuthenticated) return;
        try {
            const res = await api.get("/notifications?isRead=false&limit=1");
            setUnreadCount(res.data.data.unreadCount || 0);
        } catch (error) {
            // Silently fail to avoid console spam
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, [fetchUnreadCount]);

    const markAsRead = async (id) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setUnreadCount((prev) => Math.max(0, prev - 1));
        } catch (error) {
            console.error("Failed to mark notification as read", error);
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark all notifications as read", error);
        }
    };

    return {
        unreadCount,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
    };
};

export default useNotifications;
