import React, { useState, useEffect } from "react";

const VehicleForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        vehicleNumber: "",
        vehicleType: "4-Wheeler",
        brand: "",
        color: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                vehicleNumber: initialData.vehicleNumber || "",
                vehicleType: initialData.vehicleType || "4-Wheeler",
                brand: initialData.brand || "",
                color: initialData.color || "",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Vehicle Number</label>
                <input
                    type="text"
                    name="vehicleNumber"
                    required
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all uppercase"
                    placeholder="e.g., MH 12 AB 1234"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Vehicle Type</label>
                <select
                    name="vehicleType"
                    value={formData.vehicleType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                >
                    <option value="2-Wheeler">2 Wheeler</option>
                    <option value="4-Wheeler">4 Wheeler</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Brand/Model (Optional)</label>
                    <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Honda City"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Color (Optional)</label>
                    <input
                        type="text"
                        name="color"
                        value={formData.color}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., White"
                    />
                </div>
            </div>

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
                    {initialData ? "Update Vehicle" : "Add Vehicle"}
                </button>
            </div>
        </form>
    );
};

export default VehicleForm;
