"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Coffee, Plus, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import StatusBadge from "../../components/shared/StatusBadge";
import { useNavigate } from '@/lib/react-router-dom';
import toast from 'react-hot-toast';


const FacilityList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, del } = useApi();
    
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Modal States
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedFacility, setSelectedFacility] = useState(null);

    const fetchFacilities = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await get("/facilities");
            setFacilities(res.data.facilities || res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [get]);

    useEffect(() => {
        fetchFacilities();
    }, [fetchFacilities]);



    const handleDeleteFacility = async () => {
        try {
            await del(`/facilities/${selectedFacility._id}`);
            setIsDeleteOpen(false);
            fetchFacilities();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Facility Name",
            accessor: "facilityName",
            cell: (row) => (
                <div>
                    <p className="font-semibold text-cyber-text">{row.facilityName}</p>
                    <p className="text-xs text-cyber-muted max-w-xs truncate">{row.description}</p>
                </div>
            ),
        },
        { 
            header: "Capacity", 
            accessor: "capacity",
            cell: (row) => <span className="font-medium text-cyber-text">{row.capacity} Persons</span>
        },
        { 
            header: "Timings", 
            accessor: "timings",
            cell: (row) => <span className="text-sm text-cyber-muted">{row.openingTime} - {row.closingTime}</span>
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
                    {user?.role === "admin" && (
                        <>
                            <button
                                onClick={() => navigate(`/facilities/edit/${row._id}`, { state: row })}
                                className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => { setSelectedFacility(row); setIsDeleteOpen(true); }}
                                className="p-2 text-cyber-muted/70 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={18} />
                            </button>
                        </>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="animate-in fade-in duration-300">
            <PageHeader
                title="Society Facilities"
                subtitle="View all bookable amenities like Clubhouse, Pool, Gym."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "admin" && (
                        <button
                            onClick={() => navigate('/facilities/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Add Facility
                        </button>
                    )}
                    </>}
            />

            

            <DataTable viewMode={viewMode}
                columns={columns}
                data={facilities}
                isLoading={isLoading}
                emptyIcon={Coffee}
                emptyTitle="No facilities found"
                emptyMessage="There are no amenities configured yet."
            />

            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteFacility}
                title="Delete Facility"
                message={`Are you sure you want to delete the ${selectedFacility?.facilityName}? It cannot be recovered.`}
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
};

export default FacilityList;
