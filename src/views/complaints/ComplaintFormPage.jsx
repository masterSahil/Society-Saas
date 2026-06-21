"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import ComplaintForm from "../../components/forms/ComplaintForm";
import toast from 'react-hot-toast';

const ComplaintFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchComplaint = async () => {
                try {
                    const res = await get(`/complaints/${id}`);
                    setInitialData(res.data.complaint || res.data.data);
                } catch (error) {
                    toast.error("Failed to load complaint details");
                    navigate("/complaints");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchComplaint();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/complaints/${id}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Complaint updated successfully");
            } else {
                await post("/complaints", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                toast.success("Complaint submitted successfully");
            }
            navigate("/complaints");
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
                    onClick={() => navigate("/complaints")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Complaint" : "Raise New Complaint"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Update details of your service request." : "Report an issue or request maintenance."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <ComplaintForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/complaints")}
                />
            </div>
        </div>
    );
};

export default ComplaintFormPage;
