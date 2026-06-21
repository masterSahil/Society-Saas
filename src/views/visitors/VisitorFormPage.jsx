"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import VisitorForm from "../../components/forms/VisitorForm";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";

const VisitorFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    const { user } = useAuth();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [residents, setResidents] = useState([]);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    const fetchResidents = useCallback(async () => {
        try {
            const res = await get("/users?role=resident&limit=200");
            setResidents(res.data.users);
        } catch (error) {
            console.error(error);
        }
    }, [get]);

    useEffect(() => {
        if (user?.role === "admin" || user?.role === "security") {
            fetchResidents();
        }
    }, [fetchResidents, user]);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchVisitor = async () => {
                try {
                    const res = await get(`/visitors/${id}`);
                    setInitialData(res.data.visitor || res.data.data);
                } catch (error) {
                    toast.error("Failed to load visitor details");
                    navigate("/visitors");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchVisitor();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (data) => {
        try {
            if (isEditMode) {
                await put(`/visitors/${id}`, data);
                toast.success("Visitor updated successfully");
            } else {
                await post("/visitors", data);
                toast.success("Visitor pre-approved successfully");
            }
            navigate("/visitors");
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
                    onClick={() => navigate("/visitors")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Visitor" : "Pre-approve Visitor"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify visitor details." : "Register an expected guest."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <VisitorForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/visitors")}
                    residents={residents}
                />
            </div>
        </div>
    );
};

export default VisitorFormPage;
