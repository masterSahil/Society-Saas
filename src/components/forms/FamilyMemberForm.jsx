import React, { useState, useEffect } from "react";

const FamilyMemberForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: "",
        relation: "",
        age: "",
        phone: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                relation: initialData.relation || "",
                age: initialData.age || "",
                phone: initialData.phone || "",
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
            age: Number(formData.age)
        });
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
                    placeholder="e.g., Jane Doe"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Relation</label>
                    <input
                        type="text"
                        name="relation"
                        required
                        value={formData.relation}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Spouse"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Age</label>
                    <input
                        type="number"
                        name="age"
                        min="1"
                        max="120"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., 30"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Phone Number (Optional)</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 9876543210"
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
                    {initialData ? "Update Member" : "Add Member"}
                </button>
            </div>
        </form>
    );
};

export default FamilyMemberForm;
