"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import FlatForm from "../../components/forms/FlatForm";
import toast from 'react-hot-toast';

const FlatFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchFlat = async () => {
                try {
                    const res = await get(`/flats/${id}`);
                    setInitialData(res.data.flat || res.data.data);
                } catch (error) {
                    toast.error("Failed to load flat details");
                    navigate("/flats");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFlat();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (data) => {
        try {
            if (isEditMode) {
                await put(`/flats/${id}`, data);
                toast.success("Flat updated successfully");
            } else {
                await post("/flats", data);
                toast.success("Flat created successfully");
            }
            navigate("/flats");
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
                    onClick={() => navigate("/flats")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Flat" : "Add New Flat"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify flat details." : "Register a new unit into the society."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <FlatForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/flats")}
                />
            </div>
        </div>
    );
};

export default FlatFormPage;
