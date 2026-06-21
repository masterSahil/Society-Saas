"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Wrench, Plus, Edit2, MessageSquareWarning } from "lucide-react";
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
import StatusBadge from "../../components/shared/StatusBadge";
import toast from 'react-hot-toast';


const ComplaintList = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { get, put } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 15);
    
    const [complaints, setComplaints] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");

    // Modal States
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [maintenanceStaff, setMaintenanceStaff] = useState([]);

    const fetchComplaints = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit,
                ...(statusFilter && { status: statusFilter }),
                ...(categoryFilter && { category: categoryFilter }),
            }).toString();

            const res = await get(`/complaints?${query}`);
            setComplaints(res.data.complaints);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, statusFilter, categoryFilter, get]);

    const fetchMaintenanceStaff = useCallback(async () => {
        try {
            const res = await get("/users?role=maintenance&limit=100");
            setMaintenanceStaff(res.data.users);
        } catch (error) {
            console.error(error);
        }
    }, [get]);

    useEffect(() => {
        fetchComplaints();
    }, [fetchComplaints]);



    const handleAssign = async (e) => {
        e.preventDefault();
        const staffId = e.target.staffId.value;
        try {
            await put(`/complaints/${selectedComplaint._id}/assign`, { assignedTo: staffId });
            setIsAssignOpen(false);
            fetchComplaints();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleStatusUpdate = async (e) => {
        e.preventDefault();
        const newStatus = e.target.status.value;
        try {
            await put(`/complaints/${selectedComplaint._id}/status`, { status: newStatus });
            setIsStatusOpen(false);
            fetchComplaints();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openForm = (complaint = null) => {
        if (complaint) {
            navigate(`/complaints/edit/${complaint._id}`, { state: complaint });
        } else {
            navigate(`/complaints/new`);
        }
    };

    const columns = [
        {
            header: "Title",
            accessor: "title",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-cyber-text">{row.title}</p>
                    <p className="text-xs text-cyber-muted max-w-xs truncate">{row.description}</p>
                    {row.image && (
                        <a 
                            href={`/${row.image.replace(/\\/g, '/')}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="text-xs text-cyber-accent hover:text-cyan-300 font-medium mt-1 inline-flex items-center gap-1"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                            View Attachment
                        </a>
                    )}
                </div>
            ),
        },
        { header: "Category", accessor: "category" },
        {
            header: "Raised By",
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
            header: "Status",
            accessor: "status",
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            header: "Assigned To",
            accessor: "assignedTo",
            cell: (row) => (
                <span className={row.assignedTo ? "text-cyber-text" : "text-cyber-muted/70 italic"}>
                    {row.assignedTo?.name || "Unassigned"}
                </span>
            ),
        },
        {
            header: "Date",
            accessor: "createdAt",
            cell: (row) => <span className="text-sm text-cyber-muted">{formatDate(row.createdAt, "short")}</span>,
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Admin Actions */}
                    {user?.role === "admin" && !["Resolved", "Closed"].includes(row.status) && (
                        <button
                            onClick={() => { setSelectedComplaint(row); fetchMaintenanceStaff(); setIsAssignOpen(true); }}
                            className="text-xs font-medium bg-cyber-secondary/10 text-cyber-secondary px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                            {row.assignedTo ? "Reassign" : "Assign"}
                        </button>
                    )}
                    
                    {/* Maintenance Actions */}
                    {(user?.role === "admin" || user?.role === "maintenance") && (
                        <button
                            onClick={() => { setSelectedComplaint(row); setIsStatusOpen(true); }}
                            className="text-xs font-medium bg-cyber-text/10 text-cyber-muted px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors"
                        >
                            Update Status
                        </button>
                    )}

                    {/* Resident Actions */}
                    {user?.role === "resident" && row.status === "Open" && (
                        <button
                            onClick={() => openForm(row)}
                            className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            title="Edit"
                        >
                            <Edit2 size={18} />
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Complaints & Service Requests"
                subtitle="Track and manage maintenance requests across the society."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {["admin", "resident"].includes(user?.role) && (
                        <button
                            onClick={() => openForm()}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Raise Complaint
                        </button>
                    )}
                    </>}
            />

            <div className="flex gap-4 mb-6">
                <FilterDropdown
                    options={[
                        { label: "Open", value: "Open" },
                        { label: "Assigned", value: "Assigned" },
                        { label: "In Progress", value: "In Progress" },
                        { label: "Resolved", value: "Resolved" },
                        { label: "Closed", value: "Closed" },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    className="w-48"
                />
                <FilterDropdown
                    options={[
                        { label: "Electrical", value: "Electrical" },
                        { label: "Plumbing", value: "Plumbing" },
                        { label: "Water", value: "Water" },
                        { label: "Cleaning", value: "Cleaning" },
                        { label: "Security", value: "Security" },
                        { label: "Parking", value: "Parking" },
                        { label: "Lift", value: "Lift" },
                    ]}
                    value={categoryFilter}
                    onChange={setCategoryFilter}
                    placeholder="All Categories"
                    className="w-48"
                />
                    </div>

            <DataTable viewMode={viewMode}
                columns={columns}
                data={complaints}
                isLoading={isLoading}
                emptyIcon={MessageSquareWarning}
                emptyTitle="No complaints found"
                emptyMessage="You're all caught up! There are no complaints matching your current filters."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            {/* Dialogs */}
            <Modal
                isOpen={isAssignOpen}
                onClose={() => setIsAssignOpen(false)}
                title="Assign Maintenance Staff"
            >
                <form onSubmit={handleAssign} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-cyber-text mb-1">Select Staff Member</label>
                        <select
                            name="staffId"
                            required
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                        >
                            <option value="">-- Choose Staff --</option>
                            {maintenanceStaff.map((staff) => (
                                <option key={staff._id} value={staff._id}>{staff.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsAssignOpen(false)}
                            className="flex-1 px-4 py-2 border border-border text-cyber-muted rounded-lg hover:bg-cyber-text/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors font-medium"
                        >
                            Assign Task
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                isOpen={isStatusOpen}
                onClose={() => setIsStatusOpen(false)}
                title="Update Complaint Status"
            >
                <form onSubmit={handleStatusUpdate} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-cyber-text mb-1">New Status</label>
                        <select
                            name="status"
                            required
                            defaultValue={selectedComplaint?.status}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                        >
                            <option value="Open" disabled>Open</option>
                            <option value="Assigned" disabled>Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                            {user?.role === "admin" && <option value="Closed">Closed</option>}
                        </select>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setIsStatusOpen(false)}
                            className="flex-1 px-4 py-2 border border-border text-cyber-muted rounded-lg hover:bg-cyber-text/5 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors font-medium"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ComplaintList;
