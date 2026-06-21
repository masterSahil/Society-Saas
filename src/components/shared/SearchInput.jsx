import React from "react";
import { Search } from "lucide-react";

const SearchInput = ({ value, onChange, placeholder = "Search...", className = "" }) => {
    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-cyber-muted" />
            </div>
            <input type="text" value={value} placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-cyber-card border border-border text-cyber-text text-sm rounded-lg focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition-all placeholder-cyber-muted/50 shadow-sm hover:border-border" />
        </div>
    );
};

export default SearchInput;
