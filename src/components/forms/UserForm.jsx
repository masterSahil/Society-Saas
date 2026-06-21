import React, { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import useApi from "../../hooks/useApi";

const UserForm = ({ initialData, onSubmit, onCancel, flats }) => {
    const { isLoading } = useApi(); // Just for generic loading tracking if needed
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        role: "resident",
        flatId: "",
        password: "", // only for new user
    });
    
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                email: initialData.email || "",
                phone: initialData.phone || "",
                role: initialData.role || "resident",
                flatId: initialData.flatId?._id || initialData.flatId || "",
                password: "", // Don't populate password on edit
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Clean up empty flatId if role isn't resident
        const dataToSubmit = { ...formData };
        if (dataToSubmit.role !== "resident") {
            delete dataToSubmit.flatId;
        } else if (!dataToSubmit.flatId) {
            delete dataToSubmit.flatId;
        }

        // Don't send empty password on update
        if (initialData && !dataToSubmit.password) {
            delete dataToSubmit.password;
        }

        onSubmit(dataToSubmit);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Full Name</label>
                <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="John Doe"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Email Address</label>
                <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="john@example.com"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="9876543210"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Role</label>
                <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                >
                    <option value="resident">Resident</option>
                    <option value="admin">Admin</option>
                    <option value="security">Security</option>
                    <option value="maintenance">Maintenance</option>
                </select>
            </div>

            {formData.role === "resident" && (
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Assign Flat</label>
                    <select
                        name="flatId"
                        value={formData.flatId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                    >
                        <option value="">-- Select a Flat --</option>
                        {flats && flats.map((flat) => (
                            <option key={flat._id} value={flat._id}>
                                {flat.block} - {flat.flatNumber} ({flat.flatType})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">
                    {initialData ? "Reset Password (Optional)" : "Password"}
                </label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        required={!initialData}
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pr-10 border border-border rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition-all text-cyber-text"
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-muted hover:text-cyber-text transition-colors"
                    >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
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
                    {initialData ? "Update User" : "Create User"}
                </button>
            </div>
        </form>
    );
};

export default UserForm;
