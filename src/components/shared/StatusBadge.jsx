import React from "react";
import { CheckCircle2, Clock, XCircle, AlertCircle } from "lucide-react";

const StatusBadge = ({ status, className = "" }) => {
    // Map status string to styles
    const getStatusConfig = (statusString) => {
        const s = (statusString || "").toLowerCase();
        
        if (["approved", "paid", "resolved", "completed", "active"].includes(s)) {
            return {
                style: "bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20",
                icon: CheckCircle2
            };
        }
        
        if (["pending", "in progress", "unpaid"].includes(s)) {
            return {
                style: "bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20",
                icon: Clock
            };
        }
        
        if (["rejected", "overdue", "cancelled"].includes(s)) {
            return {
                style: "bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20",
                icon: XCircle
            };
        }
        
        // Default / Open
        return {
            style: "bg-cyber-accent/10 text-cyber-accent border border-cyber-accent/20",
            icon: AlertCircle
        };
    };

    const config = getStatusConfig(status);
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${config.style} ${className}`}>
            <Icon size={12} strokeWidth={2.5} />
            {status || "Unknown"}
        </span>
    );
};

export default StatusBadge;
