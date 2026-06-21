"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Car, Plus, Edit2, Trash2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useApi from "../../hooks/useApi";
import PageHeader from "../../components/shared/PageHeader";
import DataTable from "../../components/shared/DataTable";
import ViewToggle from "../../components/shared/ViewToggle";
import ConfirmDialog from "../../components/shared/ConfirmDialog";
import { useNavigate } from '@/lib/react-router-dom';
import toast from 'react-hot-toast';


const VehicleList = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { get, del } = useApi();
    
    const [vehicles, setVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState('table');
    
    // Modal States
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const fetchVehicles = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await get("/vehicles");
            setVehicles(res.data.vehicles || res.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [get]);

    useEffect(() => {
        fetchVehicles();
    }, [fetchVehicles]);



    const handleDeleteVehicle = async () => {
        try {
            await del(`/vehicles/${selectedVehicle._id}`);
            setIsDeleteOpen(false);
            fetchVehicles();
        } catch (error) {
            toast.error(error.message);
        }
    };

    const columns = [
        {
            header: "Vehicle No.",
            accessor: "vehicleNumber",
            cell: (row) => (
                <div className="font-bold text-cyber-text px-3 py-1 bg-cyber-text/10 rounded border border-border inline-block uppercase tracking-wider">
                    {row.vehicleNumber}
                </div>
            ),
        },
        { 
            header: "Type", 
            accessor: "vehicleType",
            cell: (row) => <span className="font-medium text-cyber-muted">{row.vehicleType}</span>
        },
        { 
            header: "Brand/Model", 
            accessor: "brand",
            cell: (row) => row.brand || <span className="text-cyber-muted/70">-</span>
        },
        { 
            header: "Color", 
            accessor: "color",
            cell: (row) => row.color ? (
                <div className="flex items-center gap-2">
                    {/* Basic color hint */}
                    <div className="w-3 h-3 rounded-full border border-border" style={{ backgroundColor: row.color.toLowerCase() }} />
                    <span className="capitalize">{row.color}</span>
                </div>
            ) : <span className="text-cyber-muted/70">-</span>
        },
        {
            header: "Actions",
            accessor: "actions",
            className: "text-right",
            cellClassName: "text-right",
            cell: (row) => (
                <div className="flex items-center justify-end gap-2">
                    {user?.role === "resident" && (
                        <>
                            <button
                                onClick={() => navigate(`/vehicles/edit/${row._id}`, { state: row })}
                                className="p-2 text-cyber-muted/70 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button
                                onClick={() => { setSelectedVehicle(row); setIsDeleteOpen(true); }}
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
                title="My Vehicles"
                subtitle="Manage registered vehicles for your apartment."
                actions={<>
                        <ViewToggle viewMode={viewMode} setViewMode={setViewMode} />
                        {user?.role === "resident" && (
                        <button
                            onClick={() => navigate("/vehicles/new")}
                            className="flex items-center gap-2 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors shadow-sm font-medium text-sm"
                        >
                            <Plus size={18} /> Add Vehicle
                        </button>
                    )}
                    </>}
            />

            

            <DataTable viewMode={viewMode}
                columns={columns}
                data={vehicles}
                isLoading={isLoading}
                emptyIcon={Car}
                emptyTitle="No vehicles found"
                emptyMessage="You haven't registered any vehicles yet."
            />

            {/* Modals */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDeleteVehicle}
                title="Delete Vehicle"
                message={`Are you sure you want to remove vehicle ${selectedVehicle?.vehicleNumber}?`}
                confirmText="Delete"
                isDestructive={true}
            />
        </div>
    );
};

export default VehicleList;
