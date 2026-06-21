"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Bell, Plus, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import { useNavigate } from '@/lib/react-router-dom';
import toast from 'react-hot-toast';


const NoticeList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, del } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 15);
    
    const [notices, setNotices] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedNotice, setSelectedNotice] = useState(null);

    const fetchNotices = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({ page, limit }).toString();
            const res = await get(`/notices?${query}`);
            setNotices(res.data.notices);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, get]);

    useEffect(() => {
        fetchNotices();
    }, [fetchNotices]);



    const handleDeleteNotice = async () => {
        try {
            await del(`/notices/${selectedNotice._id}`);
            setIsDeleteOpen(false);
            fetchNotices();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Notice",
            accessor: "title",
            cell: (row) => (
                <div className="max-w-md">
                    <p className="font-bold text-cyber-text">{row.title}</p>
                    <p className="text-sm text-cyber-muted mt-1 whitespace-normal">{row.description}</p>
                </div>
            ),
        },
        {
            header: "Posted On",
            accessor: "createdAt",
            cell: (row) => (
                <div>
                    <p className="font-medium text-cyber-text">{formatDate(row.createdAt, "short")}</p>
                    <p className="text-xs text-cyber-muted/70">by {row.createdBy?.name || "Admin"}</p>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => {
                const isExpired = row.expiryDate && new Date(row.expiryDate) < new Date();
                return <StatusBadge status={isExpired ? "inactive" : "active"} />;
            },
        },
        user?.role === "admin" ? {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/notices/edit/${row._id}`, { state: row })}
                        className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedNotice(row); setIsDeleteOpen(true); }}
                        className="p-2 text-cyber-muted/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        } : null,
    ].filter(Boolean);

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Notice Board"
                subtitle="Important announcements and updates for the society."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "admin" && (
                        <button
                            onClick={() => navigate("/notices/new")}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Publish Notice
                        </button>
                    )}
                    </>}
            />

            

            <DataTable viewMode={viewMode}
                columns={columns}
                data={notices}
                isLoading={isLoading}
                emptyIcon={Bell}
                emptyTitle="No notices"
                emptyMessage="There are no active notices at the moment."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteNotice}
                title="Delete Notice"
                message="Are you sure you want to delete this notice? It will be removed from everyone's board."
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
};

export default NoticeList;
