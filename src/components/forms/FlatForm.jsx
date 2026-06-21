import React, { useState, useEffect } from "react";

const FlatForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        block: "",
        floor: "",
        flatNumber: "",
        flatType: "2BHK",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                block: initialData.block || "",
                floor: initialData.floor || "",
                flatNumber: initialData.flatNumber || "",
                flatType: initialData.flatType || "2BHK",
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            floor: Number(formData.floor)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Block / Tower</label>
                    <input
                        type="text"
                        name="block"
                        required
                        value={formData.block}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all uppercase"
                        placeholder="e.g., A"
                        maxLength="3"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Floor</label>
                    <input
                        type="number"
                        name="floor"
                        required
                        min="0"
                        value={formData.floor}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., 5"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Flat Number</label>
                <input
                    type="text"
                    name="flatNumber"
                    required
                    value={formData.flatNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 501"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Flat Type</label>
                <select
                    name="flatType"
                    value={formData.flatType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                >
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                </select>
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
                    {initialData ? "Update Flat" : "Add Flat"}
                </button>
            </div>
        </form>
    );
};

export default FlatForm;
