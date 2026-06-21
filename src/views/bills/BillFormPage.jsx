"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import BillForm from "../../components/forms/BillForm";
import toast from 'react-hot-toast';
import { useAuth } from "../../context/AuthContext";

const BillFormPage = () => {
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
        if (user?.role === "admin") {
            try {
                const res = await get("/users?role=resident&limit=200");
                setResidents(res.data.users);
            } catch (error) {
                console.error(error);
            }
        }
    }, [user, get]);

    useEffect(() => {
        fetchResidents();
    }, [fetchResidents]);

    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchBill = async () => {
                try {
                    const res = await get(`/bills/${id}`);
                    setInitialData(res.data.bill || res.data.data);
                } catch (error) {
                    toast.error("Failed to load bill details");
                    navigate("/bills");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchBill();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/bills/${id}`, formData);
                toast.success("Bill updated successfully");
            } else {
                await post("/bills", formData);
                toast.success("Bill created successfully");
            }
            navigate("/bills");
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
                    onClick={() => navigate("/bills")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Bill" : "Create Single Bill"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify maintenance bill details." : "Generate a maintenance bill for a specific resident."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <BillForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/bills")}
                    residents={residents}
                />
            </div>
        </div>
    );
};

export default BillFormPage;
