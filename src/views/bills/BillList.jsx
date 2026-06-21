"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Receipt, Plus, CreditCard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import { formatDate } from "../../utils/formatDate";
import { formatCurrency } from "../../utils/formatCurrency";
import PageHeader from "../../components/shared/PageHeader";
import FilterDropdown from "../../components/shared/FilterDropdown";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import Modal from "../../components/shared/Modal";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import { useNavigate } from '@/lib/react-router-dom';
import toast from 'react-hot-toast';


const BillList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, post, put } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 15);
    
    const [bills, setBills] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Filters
    const [statusFilter, setStatusFilter] = useState("");
    const [monthFilter, setMonthFilter] = useState("");

    // Modal States
    const [isPayOpen, setIsPayOpen] = useState(false);
    const [isGenerateOpen, setIsGenerateOpen] = useState(false);
    const [selectedBill, setSelectedBill] = useState(null);
    const [residents, setResidents] = useState([]);

    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const fetchBills = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit,
                ...(statusFilter && { status: statusFilter }),
                ...(monthFilter && { month: monthFilter }),
            }).toString();

            const res = await get(`/bills?${query}`);
            setBills(res.data.bills);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, statusFilter, monthFilter, get]);

    const fetchResidents = useCallback(async () => {
        if (user?.role === "admin" && residents.length === 0) {
            try {
                const res = await get("/users?role=resident&limit=200");
                setResidents(res.data.users);
            } catch (error) {
                console.error(error);
            }
        }
    }, [user, residents, get]);

    useEffect(() => {
        fetchBills();
    }, [fetchBills]);



    const handlePayBill = async () => {
        try {
            await put(`/bills/${selectedBill._id}/pay`);
            setIsPayOpen(false);
            fetchBills();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleGenerateBills = async (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const data = Object.fromEntries(fd.entries());
        data.amount = Number(data.amount);
        data.year = Number(data.year);

        try {
            await post("/bills/generate", data);
            setIsGenerateOpen(false);
            fetchBills();
            toast.success("Bulk bills generated successfully!");
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Bill Period",
            accessor: "period",
            cell: (row) => <div className="font-semibold text-cyber-text">{row.month} {row.year}</div>,
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
            header: "Amount",
            accessor: "amount",
            cell: (row) => <div className="font-bold text-cyber-text">{formatCurrency(row.amount)}</div>,
        },
        {
            header: "Due Date",
            accessor: "dueDate",
            cell: (row) => (
                <div className={new Date(row.dueDate) < new Date() && row.status !== "Paid" ? "text-[#f43f5e] font-medium" : "text-cyber-muted"}>
                    {formatDate(row.dueDate, "short")}
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
                    {user?.role === "admin" && (
                        <button
                            onClick={() => navigate(`/bills/edit/${row._id}`, { state: row })}
                            className="text-xs font-medium bg-cyber-text/10 text-cyber-muted px-3 py-1.5 rounded-lg hover:bg-stone-200 transition-colors"
                        >
                            Edit
                        </button>
                    )}

                    {/* Resident Actions */}
                    {user?.role === "resident" && row.status !== "Paid" && (
                        <button
                            onClick={() => { setSelectedBill(row); setIsPayOpen(true); }}
                            className="text-xs font-medium bg-cyber-primary text-white px-3 py-1.5 rounded-lg hover:bg-cyber-primary-hover transition-colors flex items-center gap-1 shadow-sm"
                        >
                            <CreditCard size={14} /> Pay Now
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Maintenance Bills"
                subtitle="Manage society maintenance bills and payments."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "admin" && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsGenerateOpen(true)}
                                className="flex items-center gap-2 px-4 py-2 border border-border text-cyber-text bg-cyber-card rounded-lg hover:bg-cyber-text/5 transition-colors shadow-sm font-medium text-sm"
                            >
                                Bulk Generate
                            </button>
                            <button
                                onClick={() => navigate("/bills/new")}
                                className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                            >
                                <Plus size={18} /> Single Bill
                            </button>
                        </div>
                    )}
                    </>}
            />

            <div className="flex gap-4 mb-6">
                <FilterDropdown
                    options={[
                        { label: "Pending", value: "Pending" },
                        { label: "Paid", value: "Paid" },
                        { label: "Overdue", value: "Overdue" },
                    ]}
                    value={statusFilter}
                    onChange={setStatusFilter}
                    placeholder="All Statuses"
                    className="w-48"
                />
                <FilterDropdown
                    options={months.map(m => ({ label: m, value: m }))}
                    value={monthFilter}
                    onChange={setMonthFilter}
                    placeholder="All Months"
                    className="w-48"
                />
                    </div>

            <DataTable viewMode={viewMode}
                columns={columns}
                data={bills}
                isLoading={isLoading}
                emptyIcon={Receipt}
                emptyTitle="No bills found"
                emptyMessage="No bills match your current filters."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            {/* Modals */}
            <Modal
                isOpen={isGenerateOpen}
                onClose={() => setIsGenerateOpen(false)}
                title="Bulk Generate Monthly Bills"
            >
                <form onSubmit={handleGenerateBills} className="flex flex-col gap-4">
                    <p className="text-sm text-cyber-muted mb-2">
                        This action will generate identical maintenance bills for all active residents.
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1">Month</label>
                            <select
                                name="month"
                                required
                                defaultValue={months[new Date().getMonth()]}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            >
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cyber-text mb-1">Year</label>
                            <input
                                type="number"
                                name="year"
                                required
                                defaultValue={new Date().getFullYear()}
                                className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-cyber-text mb-1">Amount per Flat (₹)</label>
                        <input
                            type="number"
                            name="amount"
                            required
                            min="1"
                            placeholder="2500"
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-cyber-text mb-1">Due Date</label>
                        <input
                            type="date"
                            name="dueDate"
                            required
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                        />
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                        <button type="button" onClick={() => setIsGenerateOpen(false)} className="flex-1 px-4 py-2 border border-border text-cyber-muted rounded-lg hover:bg-cyber-text/5">Cancel</button>
                        <button type="submit" className="flex-1 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover shadow-sm">Generate All</button>
                    </div>
                </form>
            </Modal>

            <ConfirmDialog
                isOpen={isPayOpen}
                onClose={() => setIsPayOpen(false)}
                onConfirm={handlePayBill}
                title="Pay Bill"
                message={`You are about to pay ${formatCurrency(selectedBill?.amount)} for ${selectedBill?.month} ${selectedBill?.year}. Continue to mock payment gateway?`}
                confirmText="Confirm Payment"
            />
        </div>
    );
};

export default BillList;
