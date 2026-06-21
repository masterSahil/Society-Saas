"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import VehicleForm from "../../components/forms/VehicleForm";
import toast from 'react-hot-toast';

const VehicleFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchVehicle = async () => {
                try {
                    const res = await get(`/vehicles`);
                    const vehicles = res.data.vehicles || res.data || [];
                    const vehicle = vehicles.find(v => v._id === id);
                    if (vehicle) {
                        setInitialData(vehicle);
                    } else {
                        toast.error("Vehicle not found");
                        navigate("/vehicles");
                    }
                } catch (error) {
                    toast.error("Failed to load vehicle details");
                    navigate("/vehicles");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchVehicle();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/vehicles/${id}`, formData);
                toast.success("Vehicle updated successfully");
            } else {
                await post("/vehicles", formData);
                toast.success("Vehicle added successfully");
            }
            navigate("/vehicles");
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-cyber-muted animate-pulse">Loading...</div>;
    }

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/vehicles")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Vehicle" : "Add Vehicle"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify details." : "Register a vehicle for your apartment."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <VehicleForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/vehicles")}
                />
            </div>
        </div>
    );
};

export default VehicleFormPage;
