"use client";
import React from "react";
import { useNavigate } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import PollForm from "../../components/forms/PollForm";
import toast from 'react-hot-toast';

const PollFormPage = () => {
    const navigate = useNavigate();
    const { post } = useApi();

    const handleSubmit = async (formData) => {
        try {
            await post("/polls", formData);
            toast.success("Poll created successfully");
            navigate("/polls");
        } catch (error) {
            toast.error(error.message || "An error occurred");
        }
    };

    return (
        <div className="animate-in fade-in duration-300">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate("/polls")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        Create New Poll
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        Gather opinions from the community.
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <PollForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/polls")}
                />
            </div>
        </div>
    );
};

export default PollFormPage;
