"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import UserForm from "../../components/forms/UserForm";
import toast from 'react-hot-toast';

const ResidentFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [flats, setFlats] = useState([]);
    const [isLoading, setIsLoading] = useState(!initialData && id);

    const isEditMode = Boolean(id);

    // Fetch flats for the dropdown
    const fetchVacantFlats = useCallback(async () => {
        try {
            const res = await get("/flats?status=vacant&limit=100");
            setFlats(res.data.flats);
        } catch (error) {
            console.error(error);
        }
    }, [get]);

    useEffect(() => {
        fetchVacantFlats();
    }, [fetchVacantFlats]);

    // If edit mode but no state passed, fetch from API
    useEffect(() => {
        if (isEditMode && !initialData) {
            const fetchUser = async () => {
                try {
                    // Assuming we have an endpoint for single user. If not, this might fail.
                    const res = await get(`/users/${id}`);
                    setInitialData(res.data.user || res.data.data);
                } catch (error) {
                    toast.error("Failed to load user details");
                    navigate("/residents");
                } finally {
                    setIsLoading(false);
                }
            };
            fetchUser();
        }
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (data) => {
        try {
            if (isEditMode) {
                await put(`/users/${id}`, data);
                toast.success("User updated successfully");
            } else {
                await post("/auth/register", data);
                toast.success("User created successfully");
            }
            navigate("/residents");
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
                    onClick={() => navigate("/residents")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit User" : "Add New User"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify user details and roles." : "Register a new user into the system."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <UserForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/residents")}
                    flats={flats}
                />
            </div>
        </div>
    );
};

export default ResidentFormPage;
