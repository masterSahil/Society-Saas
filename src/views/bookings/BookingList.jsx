"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Calendar, Plus, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import PageHeader from "../../components/shared/PageHeader";
import FilterDropdown from "../../components/shared/FilterDropdown";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import { useNavigate } from '@/lib/react-router-dom';
import toast from 'react-hot-toast';


const BookingList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, put } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 15);
    
    const [bookings, setBookings] = useState([]);
    const [facilities, setFacilities] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [facilityFilter, setFacilityFilter] = useState("");

    // Modal States
    const [isApproveOpen, setIsApproveOpen] = useState(false);
    const [isCancelOpen, setIsCancelOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [approvalAction, setApprovalAction] = useState("");

    const fetchBookings = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit,
                ...(statusFilter && { status: statusFilter }),
                ...(facilityFilter && { facilityId: facilityFilter }),
            }).toString();

            const res = await get(`/bookings?${query}`);
            setBookings(res.data.bookings);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, statusFilter, facilityFilter, get]);

    const fetchFacilities = useCallback(async () => {
        try {
            const res = await get("/facilities");
            setFacilities(res.data.facilities);
        } catch (error) {
            console.error(error);
        }
    }, [get]);

    useEffect(() => {
        fetchBookings();
        fetchFacilities();
    }, [fetchBookings, fetchFacilities]);



    const handleApproveReject = async () => {
        try {
            await put(`/bookings/${selectedBooking._id}/approve`, { status: approvalAction });
            setIsApproveOpen(false);
            fetchBookings();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleCancel = async () => {
        try {
            await put(`/bookings/${selectedBooking._id}/cancel`);
            setIsCancelOpen(false);
            fetchBookings();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Facility",
            accessor: "facility",
            cell: (row) => <div className="font-semibold text-cyber-text">{row.facilityId?.facilityName || "Unknown"}</div>,
        },
        ...(user?.role === "admin" ? [{
            header: "Resident",
            accessor: "resident",
            cell: (row) => (
                <div>
                    <p className="font-medium">{row.residentId?.name || "Unknown"}</p>
                    {row.residentId?.flatId && (
                        <p className="text-xs text-cyber-muted">
                            {row.residentId.flatId.block}-{row.residentId.flatId.flatNumber}
                        </p>
                    )}
                </div>
            ),
        }] : []),
        {
            header: "Date & Time",
            accessor: "datetime",
            cell: (row) => (
                <div>
                    <p className="font-medium text-cyber-text">{formatDate(row.bookingDate, "short")}</p>
                    <p className="text-xs text-cyber-muted">{row.startTime} - {row.endTime}</p>
                </div>
            ),
        },
        {
            header: "Status",
            accessor: "status",
            cell: (row) => <StatusBadge status={row.status} />,
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {/* Admin Actions */}
                    {user?.role === "admin" && row.status === "Pending" && (
                        <>
                            <button
                                onClick={() => { setSelectedBooking(row); setApprovalAction("Approved"); setIsApproveOpen(true); }}
                                className="p-1.5 text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20 rounded-lg transition-colors"
                                title="Approve"
                            >
                                <CheckCircle size={18} />
                            </button>
                            <button
                                onClick={() => { setSelectedBooking(row); setApprovalAction("Rejected"); setIsApproveOpen(true); }}
                                className="p-1.5 text-[#f43f5e] bg-[#f43f5e]/10 hover:bg-[#f43f5e]/20 rounded-lg transition-colors"
                                title="Reject"
                            >
                                <XCircle size={18} />
                            </button>
                        </>
                    )}

                    {/* Resident Actions */}
                    {user?.role === "resident" && row.status !== "Cancelled" && row.status !== "Rejected" && new Date(row.bookingDate) >= new Date() && (
                        <button
                            onClick={() => { setSelectedBooking(row); setIsCancelOpen(true); }}
                            className="text-xs font-medium bg-[#f43f5e]/10 text-[#f43f5e] px-3 py-1.5 rounded-lg hover:bg-[#f43f5e]/20 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Facility Bookings"
                subtitle="Book and manage society amenities."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "resident" && (
                        <button
                            onClick={() => navigate("/bookings/new")}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> New Booking
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
                        { label: "Cancelled", value: "Cancelled" },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    className="w-48"
                />
                <FilterDropdown
                    options={facilities.map(f => ({ label: f.facilityName, value: f._id }))}
                    value={facilityFilter}
                    onChange={setFacilityFilter}
                    placeholder="All Facilities"
                    className="w-48"
                />
                    </div>

            <DataTable viewMode={viewMode}
                columns={columns}
                data={bookings}
                isLoading={isLoading}
                emptyIcon={Calendar}
                emptyTitle="No bookings found"
                emptyMessage="No facility bookings match your current filters."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            <ConfirmDialog
                isOpen={isApproveOpen}
                onClose={() => setIsApproveOpen(false)}
                onConfirm={handleApproveReject}
                title={`${approvalAction} Booking`}
                message={`Are you sure you want to ${approvalAction.toLowerCase()} the booking for ${selectedBooking?.facilityId?.facilityName}?`}
                confirmText={`Yes, ${approvalAction}`}
                isDestructive={approvalAction === "Rejected"}
            />

            <ConfirmDialog
                isOpen={isCancelOpen}
                onClose={() => setIsCancelOpen(false)}
                onConfirm={handleCancel}
                title="Cancel Booking"
                message="Are you sure you want to cancel this booking? This action cannot be undone."
                confirmText="Yes, Cancel"
                isDestructive={true}
            />
        </div>
    );
};

export default BookingList;
