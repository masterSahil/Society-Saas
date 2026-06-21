"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Home, Plus, Edit2, Trash2, UserPlus } from "lucide-react";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import PageHeader from "../../components/shared/PageHeader";
import SearchInput from "../../components/shared/SearchInput";
import FilterDropdown from "../../components/shared/FilterDropdown";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import Modal from "../../components/shared/Modal";
import { useNavigate } from '@/lib/react-router-dom';
import StatusBadge from "../../components/shared/StatusBadge";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import toast from 'react-hot-toast';


const FlatList = () => {
    const navigate = useNavigate();
    const { get, post, put, del } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 20);
    
    const [flats, setFlats] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Filters
    const [search, setSearch] = useState("");
    const [blockFilter, setBlockFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [typeFilter, setTypeFilter] = useState("");

    // Form states
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isAssignOpen, setIsAssignOpen] = useState(false);
    const [selectedFlat, setSelectedFlat] = useState(null);
    const [residents, setResidents] = useState([]);
    const [selectedResidentId, setSelectedResidentId] = useState("");

    const fetchFlats = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit,
                ...(search && { search }),
                ...(blockFilter && { block: blockFilter }),
                ...(statusFilter && { status: statusFilter }),
                ...(typeFilter && { flatType: typeFilter }),
            }).toString();

            const res = await get(`/flats?${query}`);
            setFlats(res.data.flats);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, search, blockFilter, statusFilter, typeFilter, get]);

    const fetchUnassignedResidents = useCallback(async () => {
        try {
            const res = await get("/users?role=resident&limit=200");
            // Filter residents who don't have a flat assigned
            const unassigned = res.data.users.filter(u => !u.flatId);
            setResidents(unassigned);
        } catch (error) {
            console.error(error);
        }
    }, [get]);

    useEffect(() => {
        // Use a simple timeout for search debounce here
        const timer = setTimeout(() => {
            fetchFlats();
        }, 500);
        return () => clearTimeout(timer);
    }, [fetchFlats]);



    const handleDeleteFlat = async () => {
        try {
            await del(`/flats/${selectedFlat._id}`);
            setIsDeleteOpen(false);
            fetchFlats();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleAssignFlat = async (e) => {
        e.preventDefault();
        try {
            await put(`/flats/${selectedFlat._id}/assign`, { residentId: selectedResidentId });
            setIsAssignOpen(false);
            setSelectedResidentId("");
            fetchFlats();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const openForm = (flat = null) => {
        if (flat) {
            navigate(`/flats/edit/${flat._id}`, { state: flat });
        } else {
            navigate(`/flats/new`);
        }
    };

    const openAssign = (flat) => {
        setSelectedFlat(flat);
        fetchUnassignedResidents();
        setIsAssignOpen(true);
    };

    const columns = [
        {
            header: "Flat No.",
            accessor: "flatNumber",
            cell: (row) => (
                <div className="font-bold text-cyber-text">
                    {row.block}-{row.flatNumber}
                </div>
            ),
        },
        { header: "Block", accessor: "block" },
        { header: "Floor", accessor: "floor" },
        {
            header: "Type",
            accessor: "flatType",
            cell: (row) => <span className="text-cyber-muted font-medium">{row.flatType}</span>,
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
                    {row.status === "vacant" && (
                        <button
                            onClick={() => openAssign(row)}
                            className="p-2 text-cyber-muted/70 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Assign Resident"
                        >
                            <UserPlus size={18} />
                        </button>
                    )}
                    <button
                        onClick={() => openForm(row)}
                        className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={() => { setSelectedFlat(row); setIsDeleteOpen(true); }}
                        className="p-2 text-cyber-muted/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Manage Flats"
                subtitle="View and manage all units in the society."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        <button
                        onClick={() => openForm()}
                        className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                    >
                        <Plus size={18} /> Add Flat
                    </button>
                    </>}
            />

            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search flat number..."
                    className="w-full sm:w-64"
                />
                <div className="flex gap-4 w-full sm:w-auto">
                    <FilterDropdown
                        options={[
                            { label: "Occupied", value: "occupied" },
                            { label: "Vacant", value: "vacant" },
                        ]}
                        value={statusFilter}
                        onChange={setStatusFilter}
                        placeholder="All Statuses"
                        className="w-full sm:w-40"
                    />
                    <FilterDropdown
                        options={[
                            { label: "1 BHK", value: "1BHK" },
                            { label: "2 BHK", value: "2BHK" },
                            { label: "3 BHK", value: "3BHK" },
                            { label: "4 BHK", value: "4BHK" },
                        ]}
                        value={typeFilter}
                        onChange={setTypeFilter}
                        placeholder="All Types"
                        className="w-full sm:w-40"
                    />
                    </div>
            </div>

            <DataTable viewMode={viewMode}
                columns={columns}
                data={flats}
                isLoading={isLoading}
                emptyIcon={Home}
                emptyTitle="No flats found"
                emptyMessage="We couldn't find any flats matching your criteria."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />



            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteFlat}
                title="Delete Flat"
                message={`Are you sure you want to delete Flat ${selectedFlat?.block}-${selectedFlat?.flatNumber}? This cannot be undone.`}
                confirmText="Delete"
                isDestructive={true}
            />

            <Modal
                isOpen={isAssignOpen}
                onClose={() => setIsAssignOpen(false)}
                title={`Assign Flat ${selectedFlat?.block}-${selectedFlat?.flatNumber}`}
            >
                <form onSubmit={handleAssignFlat} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-cyber-text mb-1">Select Resident</label>
                        <select
                            required
                            value={selectedResidentId}
                            onChange={(e) => setSelectedResidentId(e.target.value)}
                            className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                        >
                            <option value="">-- Choose an unassigned resident --</option>
                            {residents.map((r) => (
                                <option key={r._id} value={r._id}>
                                    {r.name} ({r.email})
                                </option>
                            ))}
                        </select>
                        {residents.length === 0 && (
                            <p className="text-xs text-rose-500 mt-2">No unassigned residents available. Please create a user with Role = Resident first.</p>
                        )}
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
                            disabled={!selectedResidentId}
                            className="flex-1 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover disabled:bg-teal-300 transition-colors font-medium"
                        >
                            Assign
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default FlatList;
