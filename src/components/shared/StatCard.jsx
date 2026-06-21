import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

const StatCard = ({ title, value, icon: Icon, trend, trendLabel, colorClass = "teal", className = "" }) => {
    // We map generic colors to our cyber theme colors
    const colorStyles = {
        teal: "bg-cyber-accent/10 text-cyber-accent border-cyber-accent/20 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]",
        emerald: "bg-[#10b981]/10 text-[#10b981] border-[#10b981]/20 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]",
        blue: "bg-cyber-secondary/10 text-cyber-secondary border-cyber-secondary/20 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]",
        indigo: "bg-cyber-primary/10 text-cyber-primary border-cyber-primary/20 drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]",
        rose: "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]",
        amber: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]",
        stone: "bg-cyber-text/5 text-cyber-muted border-border",
    };

    const iconStyle = colorStyles[colorClass] || colorStyles.teal;

    return (
        <motion.div 
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            className={`bg-cyber-card rounded-xl border border-border p-6 shadow-xl relative overflow-hidden group ${className}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-text/5 rounded-full blur-[50px] -mr-10 -mt-10 pointer-events-none group-hover:bg-white/10 transition-colors" />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <p className="text-xs font-semibold text-cyber-muted mb-2 uppercase tracking-wider">{title}</p>
                    <h3 className="text-3xl font-bold text-cyber-text tracking-tight">{value}</h3>
                </div>
                {Icon && (
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center border ${iconStyle}`}>
                        <Icon size={24} strokeWidth={1.5} />
                    </div>
                )}
            </div>

            {trend !== undefined && (
                <div className="mt-5 flex items-center text-sm relative z-10">
                    {trend > 0 ? (
                        <span className="flex items-center text-[#10b981] font-semibold bg-[#10b981]/10 px-2 py-0.5 rounded-md">
                            <TrendingUp size={14} className="mr-1" />
                            +{trend}%
                        </span>
                    ) : trend < 0 ? (
                        <span className="flex items-center text-[#f43f5e] font-semibold bg-[#f43f5e]/10 px-2 py-0.5 rounded-md">
                            <TrendingDown size={14} className="mr-1" />
                            {trend}%
                        </span>
                    ) : (
                        <span className="flex items-center text-cyber-muted font-semibold bg-cyber-text/5 px-2 py-0.5 rounded-md">
                            <Minus size={14} className="mr-1" />
                            0%
                        </span>
                    )}
                    {trendLabel && <span className="text-cyber-muted/60 ml-3 text-xs uppercase tracking-wider font-medium">{trendLabel}</span>}
                </div>
            )}
        </motion.div>
    );
};

export default StatCard;
