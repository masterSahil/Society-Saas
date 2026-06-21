"use client";
import React, { useState, useEffect } from "react";
import { Link } from '@/lib/react-router-dom';
import { CreditCard, Calendar, MessageSquareWarning, Bell, AlertTriangle, ArrowRight, Users } from "lucide-react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { formatCurrency } from "../../utils/formatCurrency";
import { formatDate, formatRelativeTime } from "../../utils/formatDate";
import PageHeader from "../shared/PageHeader";
import StatCard from "../shared/StatCard";

const Resident = () => {
    const { get } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await get("/dashboard/resident");
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
                <div className="w-12 h-12 border-4 border-cyber-accent/20 border-t-cyber-accent rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(6,182,212,0.5)]"></div>
                <p className="text-cyber-muted font-medium animate-pulse tracking-wide uppercase text-sm">Fetching Portal Data...</p>
            </div>
        );
    }

    const { 
        pendingBills = [], 
        activeComplaints = [], 
        upcomingBookings = [], 
        recentNotices = [],
        recentVisitors = []
    } = data;

    const outstandingDues = pendingBills.reduce((sum, bill) => sum + bill.amount, 0);

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-10"
        >
            <PageHeader
                title="Resident Portal"
                subtitle="Your quick overview of society activities and financial dues"
            />

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div 
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="relative bg-cyber-primary rounded-xl p-6 shadow-[0_0_20px_rgba(79,70,229,0.3)] overflow-hidden group border border-border"
                >
                    <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-text/10 rounded-full blur-[60px] -mr-10 -mt-10 pointer-events-none group-hover:bg-white/20 transition-colors" />
                    <div className="relative z-10 text-cyber-text">
                        <div className="flex items-center gap-3 mb-5 opacity-90">
                            <CreditCard size={20} className="drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                            <h3 className="font-bold tracking-wider uppercase text-xs">Outstanding Dues</h3>
                        </div>
                        <p className="text-4xl font-extrabold mb-1 tracking-tight">{formatCurrency(outstandingDues || 0)}</p>
                        <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-6">Current balance</p>
                        <Link to="/bills" className="inline-block bg-white text-cyber-primary font-bold px-5 py-2.5 rounded-lg text-sm transition-all hover:bg-white/90 hover:scale-105 active:scale-95 shadow-lg">
                            Initiate Payment
                        </Link>
                    </div>
                </motion.div>

                <StatCard 
                    title="Active Tickets" 
                    value={activeComplaints.length} 
                    icon={MessageSquareWarning} 
                    colorClass="rose"
                    className="h-full"
                />
                
                <StatCard 
                    title="Reserved Facilities" 
                    value={upcomingBookings.length} 
                    icon={Calendar} 
                    colorClass="blue"
                    className="h-full"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Notice Board Widget */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-cyber-card rounded-xl border border-border shadow-xl p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-cyber-text text-lg flex items-center gap-2 tracking-tight">
                            <Bell className="text-cyber-accent drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" size={20} /> Comms Feed
                        </h3>
                        <Link to="/notices" className="text-xs text-cyber-accent hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                            View Log <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="flex-1 space-y-3">
                        {recentNotices.length > 0 ? (
                            recentNotices.map((notice, idx) => (
                                <motion.div 
                                    whileHover={{ x: 4 }}
                                    key={idx} 
                                    className="p-4 rounded-lg bg-cyber-text/5 border border-transparent hover:border-border transition-all cursor-default group"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-cyber-text group-hover:text-cyber-accent transition-colors">{notice.title}</h4>
                                        <span className="text-[10px] font-bold text-cyber-muted bg-cyber-text/5 px-2 py-1 rounded-md uppercase tracking-wider">
                                            {formatDate(notice.createdAt, "short")}
                                        </span>
                                    </div>
                                    <p className="text-sm text-cyber-muted line-clamp-2">{notice.description}</p>
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cyber-muted border border-dashed border-border rounded-lg">
                                <AlertTriangle size={32} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium tracking-wide">No active comms in feed.</p>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* Recent Visitors Widget */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-cyber-card rounded-xl border border-border shadow-xl p-6 flex flex-col"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-cyber-text text-lg flex items-center gap-2 tracking-tight">
                            <Users className="text-cyber-secondary drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" size={20} /> Gate Log
                        </h3>
                        <Link to="/visitors" className="text-xs text-cyber-secondary hover:text-blue-400 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                            Manage <ArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="flex-1 space-y-3">
                        {recentVisitors.length > 0 ? (
                            recentVisitors.map((visitor, idx) => (
                                <motion.div 
                                    whileHover={{ x: 4 }}
                                    key={idx} 
                                    className="flex items-center justify-between p-3 rounded-lg bg-cyber-text/5 border border-transparent hover:border-border transition-all"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-cyber-secondary/20 flex items-center justify-center text-cyber-secondary font-bold uppercase border border-cyber-secondary/30 shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                                            {visitor.visitorName.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold text-cyber-text tracking-wide">{visitor.visitorName}</p>
                                            <p className="text-[10px] text-cyber-muted uppercase tracking-widest font-semibold">{visitor.visitorType}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                                            visitor.approvalStatus === 'Approved' ? 'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20' : 
                                            visitor.approvalStatus === 'Pending' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20' : 'bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20'
                                        }`}>
                                            {visitor.approvalStatus}
                                        </span>
                                        <p className="text-xs text-cyber-muted mt-2 font-medium">{formatRelativeTime(visitor.createdAt)}</p>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-cyber-muted border border-dashed border-border rounded-lg">
                                <Users size={32} className="mb-3 opacity-30" />
                                <p className="text-sm font-medium tracking-wide">No visitors recorded.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Resident;