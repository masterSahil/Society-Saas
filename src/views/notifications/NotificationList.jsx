import React, { useState, useEffect, useCallback } from "react";
import { Bell, Check } from "lucide-react";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import { formatRelativeTime } from "../../utils/formatDate";
import PageHeader from "../../components/shared/PageHeader";
import EmptyState from "../../components/shared/EmptyState";
import Pagination from "../../components/shared/Pagination";

const NotificationList = () => {
    const { get, put } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 20);
    
    const [notifications, setNotifications] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({ page, limit }).toString();
            const res = await get(`/notifications?${query}`);
            setNotifications(res.data.notifications);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, get]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            await put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await put("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Notifications"
                subtitle="Your recent alerts, updates, and messages."
                actions={
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 border border-border text-cyber-text bg-cyber-card rounded-lg hover:bg-cyber-text/5 transition-colors shadow-sm font-medium text-sm"
                    >
                        Mark all as read
                    </button>
                }
            />
            <div className="bg-cyber-card border border-border rounded-lg shadow-sm overflow-hidden flex flex-col">
                {isLoading ? (
                    <div className="min-h-[400px] flex items-center justify-center">
                        <div className="w-8 h-8 border-3 border-teal-600/30 border-t-teal-600 rounded-full animate-spin"></div>
                    </div>
                ) : notifications.length === 0 ? (
                    <EmptyState
                        icon={Bell}
                        title="All caught up!"
                        message="You have no notifications at the moment."
                    />
                ) : (
                    <>
                        <div className="divide-y divide-stone-100">
                            {notifications.map((notif) => (
                                <div 
                                    key={notif._id} 
                                    className={`p-5 flex items-start gap-4 transition-colors ${notif.isRead ? 'bg-cyber-card' : 'bg-teal-50/30'}`}
                                >
                                    <div className={`w-2 h-2 mt-2 rounded-full flex-shrink-0 ${notif.isRead ? 'bg-transparent' : 'bg-teal-500'}`}></div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-sm ${notif.isRead ? 'font-medium text-cyber-text' : 'font-bold text-cyber-text'}`}>
                                                {notif.title}
                                            </h4>
                                            <span className="text-xs text-cyber-muted/70 whitespace-nowrap ml-4">
                                                {formatRelativeTime(notif.createdAt)}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${notif.isRead ? 'text-cyber-muted' : 'text-cyber-text'}`}>
                                            {notif.message}
                                        </p>
                                    </div>
                                    {!notif.isRead && (
                                        <button 
                                            onClick={() => handleMarkAsRead(notif._id)}
                                            className="p-1.5 text-cyber-accent hover:bg-cyber-accent/20 rounded-lg transition-colors ml-2 flex-shrink-0"
                                            title="Mark as read"
                                        >
                                            <Check size={16} />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                        <Pagination 
                            pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }} 
                            onPageChange={handlePageChange} 
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default NotificationList;
