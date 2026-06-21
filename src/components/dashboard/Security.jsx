"use client";
import React, { useState, useEffect } from "react";
import { Link } from '@/lib/react-router-dom';
import { UserCheck, ShieldAlert, Users, LogIn, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { formatRelativeTime } from "../../utils/formatDate";
import PageHeader from "../shared/PageHeader";
import StatCard from "../shared/StatCard";

const Security = () => {
    const { get } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await get("/dashboard/security");
                setData(res.data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [get]);

    if (isLoading || !data) {
        return (
            <div className="h-96 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#10b981]/20 border-t-[#10b981] rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
                <p className="text-cyber-muted font-medium animate-pulse tracking-wide uppercase text-sm">Initializing Security Protocol...</p>
            </div>
        );
    }

    const { 
        todayVisitors,
        currentlyInside,
        pendingApprovals,
        recentActivity = []
    } = data;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-10"
        >
            <PageHeader
                title="Security Mainframe"
                subtitle="Monitor active gate protocols and visitor logs"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Today's Visitors" 
                    value={todayVisitors} 
                    icon={Users} 
                    colorClass="teal"
                />
                <StatCard 
                    title="Currently Inside" 
                    value={currentlyInside} 
                    icon={UserCheck} 
                    colorClass="blue"
                />
                <StatCard 
                    title="Pending Clearance" 
                    value={pendingApprovals} 
                    icon={ShieldAlert} 
                    colorClass="amber"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-cyber-card rounded-xl border border-border shadow-xl p-6 max-w-7xl mx-auto"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-cyber-text text-lg flex items-center gap-3 tracking-tight">
                        <span className="p-2 bg-cyber-primary/10 rounded-lg text-cyber-primary border border-cyber-primary/20">
                            <LogIn size={20} className="drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]" />
                        </span>
                        Live Gate Telemetry
                    </h3>
                    <Link to="/visitors" className="text-xs text-cyber-primary hover:text-indigo-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                        Full Log <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-[27px] before:w-[2px] before:bg-white/5">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, idx) => (
                            <motion.div 
                                whileHover={{ x: 4 }}
                                key={idx} 
                                className="relative flex items-center justify-between p-4 rounded-lg border border-border hover:border-border bg-cyber-text/5 transition-all group"
                            >
                                {/* Activity Line Dot */}
                                <div className={`absolute -left-3.5 w-3 h-3 rounded-full border-2 border-cyber-card ${
                                    activity.type === 'entry' ? 'bg-[#10b981] shadow-[0_0_10px_rgba(16,185,129,0.8)]' : 'bg-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.8)]'
                                }`} />

                                <div className="flex items-center gap-5 pl-2">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg border ${
                                        activity.type === 'entry' 
                                            ? 'bg-[#10b981]/10 text-[#10b981] border-[#10b981]/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
                                            : 'bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                                    }`}>
                                        {activity.visitorName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-cyber-text tracking-wide group-hover:text-cyber-accent transition-colors">{activity.visitorName}</p>
                                        <p className="text-xs text-cyber-muted mt-1 uppercase tracking-widest font-semibold">
                                            Dest: <span className="text-cyber-text">{activity.flatNo || 'N/A'}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                        activity.type === 'entry' 
                                            ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' 
                                            : 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20'
                                    }`}>
                                        {activity.type === 'entry' ? 'Access Granted' : 'Departed'}
                                    </span>
                                    <p className="text-xs text-cyber-muted mt-2 font-medium">{formatRelativeTime(activity.timestamp)}</p>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="text-center p-8 text-cyber-muted border border-dashed border-border rounded-lg bg-cyber-text/5 ml-8">
                            <ShieldAlert size={32} className="mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium tracking-wide">No gate telemetry detected.</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default Security;