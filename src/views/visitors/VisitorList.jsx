"use client";
import React, { useState, useEffect, useCallback } from "react";
import { UserCheck, Plus, CheckCircle, XCircle, LogIn, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import PageHeader from "../../components/shared/PageHeader";
import FilterDropdown from "../../components/shared/FilterDropdown";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import { useNavigate } from '@/lib/react-router-dom';
import Modal from "../../components/shared/Modal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import toast from 'react-hot-toast';


const VisitorList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, put } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 15);
    
    const [visitors, setVisitors] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    // Action states
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [selectedVisitor, setSelectedVisitor] = useState(null);
    const [approvalAction, setApprovalAction] = useState(""); // "Approved" or "Rejected"

    const openForm = (visitor = null) => {
        if (visitor) {
            navigate(`/visitors/edit/${visitor._id}`, { state: visitor });
        } else {
            navigate(`/visitors/new`);
        }
    };

    const fetchVisitors = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit,
                ...(statusFilter && { approvalStatus: statusFilter }),
                ...(typeFilter && { visitorType: typeFilter }),
            }).toString();

            const res = await get(`/visitors?${query}`);
            setVisitors(res.data.visitors);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, statusFilter, typeFilter, get]);

    useEffect(() => {
        fetchVisitors();
    }, [fetchVisitors]);

    const handleApproveReject = async () => {
        try {
            await put(`/visitors/${selectedVisitor._id}/approve`, { approvalStatus: approvalAction });
            setIsApproveOpen(false);
            fetchVisitors();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGateAction = async (visitorId, action) => {
        // action is "entry" or "exit"
        try {
            await put(`/visitors/${visitorId}/${action}`);
            fetchVisitors();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Visitor",
            accessor: "visitorName",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-cyber-text">{row.visitorName}</p>
                    <p className="text-xs text-cyber-muted">{row.mobile}</p>
                </div>
            ),
        },
        {
            header: "Type & Purpose",
            accessor: "visitorType",
            cell: (row) => (
                <div>
                    <span className="capitalize font-medium text-cyber-text">{row.visitorType}</span>
                    {row.purpose && <p className="text-xs text-cyber-muted">{row.purpose}</p>}
                </div>
            ),
        },
        {
            header: "Visiting",
            accessor: "resident",
            cell: (row) => (
                <div>
                    <p className="text-sm font-medium">{row.residentId?.name || "Unknown"}</p>
                    {row.residentId?.flatId && (
                        <p className="text-xs text-cyber-muted">
                            {row.residentId.flatId.block}-{row.residentId.flatId.flatNumber}
                        </p>
                    )}
                </div>
            ),
        },
        {
            header: "Approval",
            accessor: "approvalStatus",
            cell: (row) => <StatusBadge status={row.approvalStatus} />,
        },
        {
            header: "Entry / Exit",
            accessor: "time",
            cell: (row) => (
                <div className="text-xs text-cyber-muted whitespace-nowrap">
                    <div><span className="text-cyber-muted/70">In:</span> {row.entryTime ? formatDate(row.entryTime, "time") : "-"}</div>
                    <div><span className="text-cyber-muted/70">Out:</span> {row.exitTime ? formatDate(row.exitTime, "time") : "-"}</div>
                </div>
            ),
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Resident and Admin Actions */}
                    {["resident", "admin"].includes(user?.role) && row.approvalStatus === "Pending" && (
                        <>
                            <button
                                onClick={() => { setSelectedVisitor(row); setApprovalAction("Approved"); setIsApproveOpen(true); }}
                                className="p-1.5 text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20 rounded-lg transition-colors"
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button
                                onClick={() => { setSelectedVisitor(row); setApprovalAction("Rejected"); setIsApproveOpen(true); }}
                                className="p-1.5 text-[#f43f5e] bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 rounded-lg transition-colors"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}

                    {/* Security and Admin Actions */}
                    {["security", "admin"].includes(user?.role) && row.approvalStatus === "Approved" && !row.entryTime && (
                        <button
                            onClick={() => handleGateAction(row._id, "entry")}
                            className="text-xs font-medium bg-cyber-accent/10 text-cyber-accent px-3 py-1.5 rounded-lg hover:bg-cyber-accent/20 transition-colors flex items-center gap-1"
                        >
                            <LogIn size={14} /> Mark Entry
                        </button>
                    )}
                    {["security", "admin"].includes(user?.role) && row.entryTime && !row.exitTime && (
                        <button
                            onClick={() => handleGateAction(row._id, "exit")}
                            className="text-xs font-medium bg-[#f59e0b]/10 text-[#f59e0b] px-3 py-1.5 rounded-lg hover:bg-[#f59e0b]/20 transition-colors flex items-center gap-1"
                        >
                            <LogOut size={14} /> Mark Exit
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Visitor Log"
                subtitle="Manage and track visitors entering the society."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {["admin", "security", "resident"].includes(user?.role) && (
                        <button
                            onClick={() => openForm()}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Pre-Approve Visitor
                        </button>
                    )}
                    </>}
            />

            <div className="flex gap-4 mb-6">
                <FilterDropdown
                    options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Approved", value: "Approved" },
                        { label: "Rejected", value: "Rejected" },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    className="w-48"
                />
                <FilterDropdown
                    options={[
                        { label: "Guest", value: "guest" },
                        { label: "Delivery", value: "delivery" },
                    ]}
                    value={typeFilter}
                    onChange={setTypeFilter}
                    placeholder="All Types"
                    className="w-48"
                />
                    </div>

            <DataTable viewMode={viewMode}
                columns={columns}
                data={visitors}
                isLoading={isLoading}
                emptyIcon={UserCheck}
                emptyTitle="No visitors found"
                emptyMessage="No visitor records match your current filters."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            <ConfirmDialog
                isOpen={isApproveOpen}
                onClose={() => setIsApproveOpen(false)}
                onConfirm={handleApproveReject}
                title={`${approvalAction} Visitor`}
                message={`Are you sure you want to ${approvalAction.toLowerCase()} entry for ${selectedVisitor?.visitorName}?`}
                confirmText={`Yes, ${approvalAction}`}
                isDestructive={approvalAction === "Rejected"}
            />
        </div>
    );
};

export default VisitorList;
