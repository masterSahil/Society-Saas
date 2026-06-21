import React, { useState } from "react";

const BookingForm = ({ onSubmit, onCancel, facilities }) => {
    const [formData, setFormData] = useState({
        facilityId: "",
        bookingDate: "",
        startTime: "",
        endTime: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // Get today's date in YYYY-MM-DD for min attribute
    const today = new Date().toISOString().split("T")[0];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Facility</label>
                <select
                    name="facilityId"
                    required
                    value={formData.facilityId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all bg-cyber-card"
                >
                    <option value="">-- Select Facility --</option>
                    {facilities && facilities.filter(f => f.isActive).map((f) => (
                        <option key={f._id} value={f._id}>
                            {f.facilityName} ({f.openingTime} - {f.closingTime})
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Booking Date</label>
                <input
                    type="date"
                    name="bookingDate"
                    required
                    min={today}
                    value={formData.bookingDate}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Start Time</label>
                    <input
                        type="time"
                        name="startTime"
                        required
                        value={formData.startTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">End Time</label>
                    <input
                        type="time"
                        name="endTime"
                        required
                        value={formData.endTime}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
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
                    Request Booking
                </button>
            </div>
        </form>
    );
};

export default BookingForm;
