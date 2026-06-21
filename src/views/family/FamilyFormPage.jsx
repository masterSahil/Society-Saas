"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import FamilyMemberForm from "../../components/forms/FamilyMemberForm";
import toast from 'react-hot-toast';

const FamilyFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchFamilyMember = async () => {
                try {
                    // Fetch all and find the specific one, or if there's a specific endpoint, use it.
                    // The backend returns an array of family members for the resident.
                    const res = await get(`/family`);
                    const members = res.data.members || res.data || [];
                    const member = members.find(m => m._id === id);
                    if (member) {
                        setInitialData(member);
                    } else {
                        toast.error("Family member not found");
                        navigate("/family");
                    }
                } catch (error) {
                    toast.error("Failed to load family details");
                    navigate("/family");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchFamilyMember();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/family/${id}`, formData);
                toast.success("Family member updated successfully");
            } else {
                await post("/family", formData);
                toast.success("Family member added successfully");
            }
            navigate("/family");
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
                    onClick={() => navigate("/family")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Family Member" : "Add Family Member"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify details." : "Register a family member living with you."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <FamilyMemberForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/family")}
                />
            </div>
        </div>
    );
};

export default FamilyFormPage;
