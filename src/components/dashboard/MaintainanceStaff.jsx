"use client";
import React, { useState, useEffect } from "react";
import { Link } from '@/lib/react-router-dom';
import { AlertCircle, Clock, CheckCircle2, Wrench, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import { formatDate } from "../../utils/formatDate";
import PageHeader from "../shared/PageHeader";
import StatCard from "../shared/StatCard";

const MaintainanceStaff = () => {
    const { get, put } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await get("/dashboard/maintenance");
                setData(res.data);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, [get]);

    const handleStatusUpdate = async (complaintId, newStatus) => {
        try {
            await put(`/complaints/${complaintId}/status`, { status: newStatus });
            // Refresh dashboard
            const res = await get("/dashboard/maintenance");
            setData(res.data);
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    if (isLoading || !data) {
        return (
            <div className="h-96 flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#f59e0b]/20 border-t-[#f59e0b] rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(245,158,11,0.5)]"></div>
                <p className="text-cyber-muted font-medium animate-pulse tracking-wide uppercase text-sm">Loading Maintenance Protocols...</p>
            </div>
        );
    }

    const { 
        assignedTickets = 0,
        pendingTickets = 0,
        completedTickets = 0,
        activeTasks = []
    } = data;

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-10"
        >
            <PageHeader
                title="Operations Dashboard"
                subtitle="Manage your assigned maintenance tasks and update statuses"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatCard 
                    title="Assigned Tasks" 
                    value={assignedTickets} 
                    icon={Wrench} 
                    colorClass="indigo"
                />
                <StatCard 
                    title="Pending Action" 
                    value={pendingTickets} 
                    icon={Clock} 
                    colorClass="amber"
                />
                <StatCard 
                    title="Completed Today" 
                    value={completedTickets} 
                    icon={CheckCircle2} 
                    colorClass="emerald"
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-cyber-card rounded-xl border border-border shadow-xl p-6"
            >
                <div className="flex items-center justify-between mb-8">
                    <h3 className="font-bold text-cyber-text text-lg flex items-center gap-3 tracking-tight">
                        <span className="p-2 bg-cyber-accent/10 rounded-lg text-cyber-accent border border-cyber-accent/20">
                            <AlertCircle size={20} className="drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                        </span>
                        Active Tasks Pipeline
                    </h3>
                    <Link to="/complaints" className="text-xs text-cyber-accent hover:text-cyan-300 font-bold uppercase tracking-wider flex items-center gap-1 transition-colors">
                        View All Tasks <ArrowRight size={14} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border text-xs font-semibold text-cyber-muted uppercase tracking-wider">
                                <th className="pb-4 pl-4 font-semibold">Task ID</th>
                                <th className="pb-4 font-semibold">Location</th>
                                <th className="pb-4 font-semibold">Category</th>
                                <th className="pb-4 font-semibold">Description</th>
                                <th className="pb-4 font-semibold">Status</th>
                                <th className="pb-4 pr-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {activeTasks.length > 0 ? (
                                activeTasks.map((task) => (
                                    <motion.tr 
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                                        key={task._id} 
                                        className="text-sm transition-colors group"
                                    >
                                        <td className="py-4 pl-4 font-mono text-cyber-muted text-xs">#{task._id.slice(-6)}</td>
                                        <td className="py-4 font-bold text-cyber-text">{task.flatId?.flatNumber || "N/A"}</td>
                                        <td className="py-4">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-cyber-text/5 text-cyber-muted border border-border">
                                                {task.category}
                                            </span>
                                        </td>
                                        <td className="py-4 text-cyber-muted max-w-xs truncate pr-4">{task.description}</td>
                                        <td className="py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${
                                                task.status === 'Open' ? 'bg-[#f43f5e]/10 text-[#f43f5e] border border-[#f43f5e]/20' : 
                                                task.status === 'In Progress' ? 'bg-[#f59e0b]/10 text-[#f59e0b] border border-[#f59e0b]/20' : 
                                                'bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/20'
                                            }`}>
                                                {task.status}
                                            </span>
                                        </td>
                                        <td className="py-4 pr-4 text-right">
                                            <select 
                                                className="bg-cyber-surface border border-border text-cyber-text text-xs rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-cyber-primary focus:border-transparent outline-none transition-all cursor-pointer font-medium"
                                                value={task.status}
                                                onChange={(e) => handleStatusUpdate(task._id, e.target.value)}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-12 text-center text-cyber-muted">
                                        <Wrench size={32} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium tracking-wide">No active tasks in pipeline.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MaintainanceStaff;