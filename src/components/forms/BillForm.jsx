import React, { useState, useEffect } from "react";

const BillForm = ({ initialData, onSubmit, onCancel, residents }) => {
    const currentYear = new Date().getFullYear();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const [formData, setFormData] = useState({
        residentId: "",
        month: months[new Date().getMonth()],
        year: currentYear,
        amount: "",
        dueDate: "",
        status: "Pending",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                residentId: initialData.residentId?._id || initialData.residentId || "",
                month: initialData.month || months[new Date().getMonth()],
                year: initialData.year || currentYear,
                amount: initialData.amount || "",
                dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : "",
                status: initialData.status || "Pending",
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
            amount: Number(formData.amount),
            year: Number(formData.year)
        });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!initialData && (
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Resident</label>
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

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Month</label>
                    <select
                        name="month"
                        required
                        value={formData.month}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                    >
                        {months.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Year</label>
                    <input type="number" name="year" required min="2000" max="2100" value={formData.year} onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                        placeholder="Enter year..." />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Amount (₹)</label>
                <input
                    type="number"
                    name="amount"
                    required
                    min="1"
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., 2500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Due Date</label>
                <input
                    type="date"
                    name="dueDate"
                    required
                    value={formData.dueDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            {initialData && (
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                    >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Overdue">Overdue</option>
                    </select>
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
                    {initialData ? "Update Bill" : "Create Bill"}
                </button>
            </div>
        </form>
    );
};

export default BillForm;
