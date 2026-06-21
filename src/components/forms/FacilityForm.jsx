import React, { useState, useEffect } from "react";

const FacilityForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        facilityName: "",
        description: "",
        capacity: "",
        openingTime: "06:00",
        closingTime: "22:00",
        isActive: true,
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                facilityName: initialData.facilityName || "",
                description: initialData.description || "",
                capacity: initialData.capacity || "",
                openingTime: initialData.openingTime || "06:00",
                closingTime: initialData.closingTime || "22:00",
                isActive: initialData.isActive !== false,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            capacity: Number(formData.capacity)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Facility Name</label>
                <input
                    type="text"
                    name="facilityName"
                    required
                    value={formData.facilityName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Clubhouse"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Description</label>
                <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Brief description of the facility"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Capacity</label>
                <input
                    type="number"
                    name="capacity"
                    required
                    min="1"
                    value={formData.capacity}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 50"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Opening Time</label>
                    <input
                        type="time"
                        name="openingTime"
                        required
                        value={formData.openingTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Closing Time</label>
                    <input
                        type="time"
                        name="closingTime"
                        required
                        value={formData.closingTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>
            </div>

            {initialData && (
                <div className="flex items-center gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="isActive"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-cyber-accent bg-cyber-text/10 border-border rounded focus:ring-teal-500"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-cyber-text">
                        Facility is currently active and available for booking
                    </label>
                </div>
            )}

            <div className="flex items-center gap-3 mt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 border border-border text-cyber-muted rounded-lg hover:bg-cyber-text/5 transition-colors font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-cyber-primary text-white rounded-lg hover:bg-cyber-primary-hover transition-colors font-medium"
                >
                    {initialData ? "Update Facility" : "Add Facility"}
                </button>
            </div>
        </form>
    );
};

export default FacilityForm;
