import React, { useState, useEffect } from "react";

const NoticeForm = ({ initialData, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        expiryDate: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                description: initialData.description || "",
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : "",
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

    const today = new Date().toISOString().split("T")[0];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Notice Title</label>
                <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Water Supply Interruption"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Description</label>
                <textarea
                    name="description"
                    required
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all resize-none"
                    placeholder="Provide details about the notice..."
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Expiry Date (Optional)</label>
                <input
                    type="date"
                    name="expiryDate"
                    min={today}
                    value={formData.expiryDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
                <p className="text-xs text-cyber-muted mt-1">Notice will automatically disappear after this date.</p>
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
                    {initialData ? "Update Notice" : "Publish Notice"}
                </button>
            </div>
        </form>
    );
};

export default NoticeForm;
