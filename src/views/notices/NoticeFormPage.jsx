"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import NoticeForm from "../../components/forms/NoticeForm";
import toast from 'react-hot-toast';

const NoticeFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchNotice = async () => {
                try {
                    const res = await get(`/notices/${id}`);
                    setInitialData(res.data.notice || res.data.data);
                } catch (error) {
                    toast.error("Failed to load notice details");
                    navigate("/notices");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchNotice();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/notices/${id}`, formData);
                toast.success("Notice updated successfully");
            } else {
                await post("/notices", formData);
                toast.success("Notice published successfully");
            }
            navigate("/notices");
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
                    onClick={() => navigate("/notices")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Notice" : "Publish Notice"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Update an existing announcement." : "Broadcast an announcement to the society."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <NoticeForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/notices")}
                />
            </div>
        </div>
    );
};

export default NoticeFormPage;
