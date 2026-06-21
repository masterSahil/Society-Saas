import React, { useState } from "react";
import { Plus, X } from "lucide-react";
import toast from 'react-hot-toast';


const PollForm = ({ onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        question: "",
        startDate: new Date().toISOString().split('T')[0],
        endDate: "",
    });
    
    const [options, setOptions] = useState(["", ""]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleOptionChange = (index, value) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        if (options.length < 6) {
            setOptions([...options, ""]);
        }
    };

    const removeOption = (index) => {
        if (options.length > 2) {
            const newOptions = options.filter((_, i) => i !== index);
            setOptions(newOptions);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Filter out empty options
        const validOptions = options.map(opt => opt.trim()).filter(opt => opt !== "");
        
        if (validOptions.length < 2) {
            toast.error("Please provide at least 2 valid options.");
            return;
        }

        onSubmit({
            ...formData,
            options: validOptions
        });
    };

    const today = new Date().toISOString().split("T")[0];

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
                <label className="block text-sm font-medium text-cyber-text mb-1">Poll Question</label>
                <input
                    type="text"
                    name="question"
                    required
                    value={formData.question}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    placeholder="e.g., Should we install solar panels?"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-cyber-text mb-2">Options</label>
                <div className="space-y-3">
                    {options.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <input
                                type="text"
                                required
                                value={option}
                                onChange={(e) => handleOptionChange(index, e.target.value)}
                                className="flex-1 px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                                placeholder={`Option ${index + 1}`}
                            />
                            {options.length > 2 && (
                                <button
                                    type="button"
                                    onClick={() => removeOption(index)}
                                    className="p-2 text-cyber-muted/70 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                
                {options.length < 6 && (
                    <button
                        type="button"
                        onClick={addOption}
                        className="mt-3 text-sm flex items-center text-cyber-accent font-medium hover:text-cyan-300"
                    >
                        <Plus size={16} className="mr-1" /> Add Option
                    </button>
                )}
            </div>

            <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        required
                        min={today}
                        value={formData.startDate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-cyber-text mb-1">End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        required
                        min={formData.startDate || today}
                        value={formData.endDate}
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
                    Create Poll
                </button>
            </div>
        </form>
    );
};

export default PollForm;
