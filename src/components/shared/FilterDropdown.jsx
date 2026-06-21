import React from "react";
import { Filter } from "lucide-react";

const FilterDropdown = ({ options, value, onChange, placeholder = "Filter", className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter size={16} className="text-cyber-muted" />
            </div>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full pl-9 pr-8 py-2.5 bg-cyber-card border border-border text-cyber-text text-sm rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition-all appearance-none cursor-pointer font-medium shadow-sm hover:border-border"
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value} className="bg-cyber-surface text-cyber-text">
                        {opt.label}
                    </option>
                ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-cyber-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default FilterDropdown;
