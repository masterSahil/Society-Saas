"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import FacilityForm from "../../components/forms/FacilityForm";
import toast from 'react-hot-toast';

const FacilityFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchFacility = async () => {
                try {
                    const res = await get(`/facilities`);
                    const facilities = res.data.facilities || res.data || [];
                    const facility = facilities.find(f => f._id === id);
                    if (facility) {
                        setInitialData(facility);
                    } else {
                        toast.error("Facility not found");
                        navigate("/facilities");
                    }
                } catch (error) {
                    toast.error("Failed to load facility details");
                    navigate("/facilities");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFacility();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/facilities/${id}`, formData);
                toast.success("Facility updated successfully");
            } else {
                await post("/facilities", formData);
                toast.success("Facility added successfully");
            }
            navigate("/facilities");
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
                    onClick={() => navigate("/facilities")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Facility" : "Add Facility"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify details." : "Register a new bookable amenity."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <FacilityForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/facilities")}
                />
            </div>
        </div>
    );
};

export default FacilityFormPage;
