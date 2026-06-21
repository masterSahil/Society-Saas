import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

const VisitorForm = ({ onSubmit, onCancel, residents }) => {
    const { user } = useAuth();
    const isSecurity = user?.role === "security";

    const [formData, setFormData] = useState({
        residentId: isSecurity ? "" : user?._id || "",
        visitorName: "",
        mobile: "",
        purpose: "",
        visitorType: "guest",
    });

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
            {isSecurity && (
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Visiting Resident/Flat</label>
                    <select
                        name="residentId"
                        required
                        value={formData.residentId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                    >
                        <option value="">-- Select Resident --</option>
                        {residents && residents.map((r) => (
                            <option key={r._id} value={r._id}>
                                {r.name} - {r.flatId?.block}-{r.flatId?.flatNumber}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Visitor Name</label>
                <input
                    type="text"
                    name="visitorName"
                    required
                    value={formData.visitorName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., John Doe"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Mobile Number</label>
                <input
                    type="tel"
                    name="mobile"
                    required
                    value={formData.mobile}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 9876543210"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Visitor Type</label>
                <select
                    name="visitorType"
                    value={formData.visitorType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                >
                    <option value="guest">Guest</option>
                    <option value="delivery">Delivery</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Purpose (Optional)</label>
                <input
                    type="text"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder={formData.visitorType === "guest" ? "e.g., Personal Visit" : "e.g., Amazon Delivery"}
                />
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
                    Add Visitor
                </button>
            </div>
        </form>
    );
};

export default VisitorForm;
