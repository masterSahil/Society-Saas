"use client";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from '@/lib/react-router-dom';
import { ArrowLeft } from "lucide-react";
import useApi from "../../hooks/useApi";
import BookingForm from "../../components/forms/BookingForm";
import toast from 'react-hot-toast';

const BookingFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { get, post, put } = useApi();
    
    const [initialData, setInitialData] = useState(location.state || null);
    const [facilities, setFacilities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const isEditMode = Boolean(id);

    useEffect(() => {
        const fetchDependencies = async () => {
            try {
                // Fetch facilities
                const facRes = await get("/facilities");
                setFacilities(facRes.data.facilities || []);

                // If editing (though usually bookings are only created or cancelled), fetch booking
                if (isEditMode && !initialData) {
                    const bookRes = await get(`/bookings/${id}`);
                    setInitialData(bookRes.data.booking || bookRes.data.data);
                }
            } catch (error) {
                toast.error("Failed to load necessary details");
                navigate("/bookings");
            } finally {
                setIsLoading(false);
            }
        };
        fetchDependencies();
    }, [isEditMode, initialData, id, get, navigate]);

    const handleSubmit = async (formData) => {
        try {
            if (isEditMode) {
                await put(`/bookings/${id}`, formData);
                toast.success("Booking updated successfully");
            } else {
                await post("/bookings", formData);
                toast.success("Booking requested successfully");
            }
            navigate("/bookings");
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
                    onClick={() => navigate("/bookings")}
                    className="p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-cyber-text tracking-tight">
                        {isEditMode ? "Edit Booking" : "New Facility Booking"}
                    </h1>
                    <p className="text-sm text-cyber-muted">
                        {isEditMode ? "Modify your booking." : "Reserve a society amenity for your use."}
                    </p>
                </div>
            </div>

            <div className="bg-cyber-card border border-border rounded-xl shadow-sm p-6">
                <BookingForm
                    initialData={initialData}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate("/bookings")}
                    facilities={facilities}
                />
            </div>
        </div>
    );
};

export default BookingFormPage;
