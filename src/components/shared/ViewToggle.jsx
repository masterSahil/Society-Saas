import React from "react";
import { LayoutGrid, List } from "lucide-react";
import { motion } from "framer-motion";

const ViewToggle = ({ viewMode, setViewMode }) => {
    return (
        <div className="flex bg-cyber-surface border border-border rounded-xl p-1 shadow-sm w-max h-min items-center">
            <button
                onClick={() => setViewMode("table")}
                className={`relative px-3.5 py-2 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    viewMode === "table" ? "text-cyber-primary" : "text-cyber-muted hover:text-cyber-text"
                }`}
                title="List View"
            >
                {viewMode === "table" && (
                    <motion.div
                        layoutId="viewToggle"
                        className="absolute inset-0 bg-cyber-card rounded-lg shadow-sm border border-border"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                )}
                <span className="relative z-10"><List strokeWidth={2.5} size={18} /></span>
            </button>
            
            <button
                onClick={() => setViewMode("card")}
                className={`relative px-3.5 py-2 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                    viewMode === "card" ? "text-cyber-primary" : "text-cyber-muted hover:text-cyber-text"
                }`}
                title="Grid View"
            >
                {viewMode === "card" && (
                    <motion.div
                        layoutId="viewToggle"
                        className="absolute inset-0 bg-cyber-card rounded-lg shadow-sm border border-border"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                )}
                <span className="relative z-10"><LayoutGrid strokeWidth={2.5} size={18} /></span>
            </button>
        </div>
    );
};

export default ViewToggle;
