"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Users, Plus, Edit2, Trash2, Shield, UserX, UserCheck } from "lucide-react";
import useApi from "../../hooks/useApi";
import usePagination from "../../hooks/usePagination";
import useDebounce from "../../hooks/useDebounce";
import PageHeader from "../../components/shared/PageHeader";
import SearchInput from "../../components/shared/SearchInput";
import FilterDropdown from "../../components/shared/FilterDropdown";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import { useNavigate } from '@/lib/react-router-dom';
import StatusBadge from "../../components/shared/StatusBadge";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import toast from 'react-hot-toast';


const ResidentList = () => {
    const navigate = useNavigate();
    const { get, put, del } = useApi();
    const { page, limit, handlePageChange } = usePagination(1, 15);
    
    const [users, setUsers] = useState([]);
    const [total, setTotal] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Filters
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const [roleFilter, setRoleFilter] = useState("");
    const [activeFilter, setActiveFilter] = useState("");

    // Modal States
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isToggleOpen, setIsToggleOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        try {
            const query = new URLSearchParams({
                page,
                limit,
                ...(debouncedSearch && { search: debouncedSearch }),
                ...(roleFilter && { role: roleFilter }),
                ...(activeFilter !== "" && { isActive: activeFilter }),
            }).toString();

            const res = await get(`/users?${query}`);
            setUsers(res.data.users);
            setTotal(res.data.pagination.total);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [page, limit, debouncedSearch, roleFilter, activeFilter, get]);



    const handleDeleteUser = async () => {
        try {
            await del(`/users/${selectedUser._id}`);
            setIsDeleteOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const handleToggleActive = async () => {
        try {
            await put(`/users/${selectedUser._id}/toggle-active`);
            setIsToggleOpen(false);
            fetchUsers();
        } catch (error) {
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const openForm = (user = null) => {
        if (user) {
            navigate(`/residents/edit/${user._id}`, { state: user });
        } else {
            navigate(`/residents/new`);
        }
    };

    const columns = [
        {
            header: "Name",
            accessor: "name",
            cell: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyber-text/10 flex items-center justify-center text-cyber-accent font-bold border border-border">
                        {row.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="font-semibold text-cyber-text">{row.name}</p>
                        <p className="text-xs text-cyber-muted">{row.email}</p>
                    </div>
                </div>
            ),
        },
        { header: "Phone", accessor: "phone" },
        {
            header: "Role",
            accessor: "role",
            cell: (row) => (
                <span className="flex items-center gap-1 text-sm font-medium text-cyber-muted capitalize">
                    {row.role === "admin" && <Shield size={14} className="text-rose-500" />}
                    {row.role}
                </span>
            ),
        },
        {
            header: "Flat",
            accessor: "flatId",
            cell: (row) => row.flatId ? `${row.flatId.block}-${row.flatId.flatNumber}` : <span className="text-cyber-muted/70">-</span>,
        },
        {
            header: "Status",
            accessor: "isActive",
            cell: (row) => <StatusBadge status={row.isActive ? "active" : "inactive"} />,
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={(e) => { e.stopPropagation(); openForm(row); }}
                        className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedUser(row); setIsToggleOpen(true); }}
                        className={`p-2 rounded-lg transition-colors ${row.isActive ? "text-cyber-muted/70 hover:text-amber-600 hover:bg-amber-50" : "text-cyber-muted/70 hover:text-emerald-600 hover:bg-emerald-50"}`}
                        title={row.isActive ? "Deactivate" : "Activate"}
                    >
                        {row.isActive ? <UserX size={18} /> : <UserCheck size={18} />}
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setSelectedUser(row); setIsDeleteOpen(true); }}
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
                title="Manage Residents & Users"
                subtitle="View and manage all registered users in the society."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        <button
                        onClick={() => openForm()}
                        className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                    >
                        <Plus size={18} /> Add User
                    </button>
                    </>}
            />

            {/* Filters Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <SearchInput
                    value={search}
                    onChange={setSearch}
                    placeholder="Search by name, email or phone..."
                    className="w-full sm:w-96"
                />
                <div className="flex gap-4 w-full sm:w-auto">
                    <FilterDropdown
                        options={[
                            { label: "Admin", value: "admin" },
                            { label: "Resident", value: "resident" },
                            { label: "Security", value: "security" },
                            { label: "Maintenance", value: "maintenance" },
                        ]}
                        value={roleFilter}
                        onChange={setRoleFilter}
                        placeholder="All Roles"
                        className="w-full sm:w-48"
                    />
                    <FilterDropdown
                        options={[
                            { label: "Active", value: "true" },
                            { label: "Inactive", value: "false" },
                        ]}
                        value={activeFilter}
                        onChange={setActiveFilter}
                        placeholder="All Statuses"
                        className="w-full sm:w-48"
                    />
                    </div>
            </div>

            <DataTable viewMode={viewMode}
                columns={columns}
                data={users}
                isLoading={isLoading}
                emptyIcon={Users}
                emptyTitle="No users found"
                emptyMessage="We couldn't find any users matching your criteria."
                pagination={{ page, limit, total, totalPages: Math.ceil(total / limit) }}
                onPageChange={handlePageChange}
            />

            {/* Dialogs */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteUser}
                title="Delete User"
                message={`Are you sure you want to delete ${selectedUser?.name}? This action cannot be undone.`}
                confirmText="Delete"
                isDestructive={true}
            />

            <ConfirmDialog
                isOpen={isToggleOpen}
                onClose={() => setIsToggleOpen(false)}
                onConfirm={handleToggleActive}
                title={selectedUser?.isActive ? "Deactivate User" : "Activate User"}
                message={`Are you sure you want to ${selectedUser?.isActive ? "deactivate" : "activate"} ${selectedUser?.name}?`}
                confirmText={selectedUser?.isActive ? "Deactivate" : "Activate"}
                isDestructive={selectedUser?.isActive}
            />
        </div>
    );
};

export default ResidentList;
