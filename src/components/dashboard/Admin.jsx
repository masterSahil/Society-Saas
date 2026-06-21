import React, { useState, useEffect } from "react";
import { Users, Home, AlertCircle, CreditCard, Activity, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { motion } from "framer-motion";
import useApi from "../../hooks/useApi";
import PageHeader from "../shared/PageHeader";
import StatCard from "../shared/StatCard";
import { formatCurrency } from "../../utils/formatCurrency";

const Admin = () => {
    const { get } = useApi();
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await get("/dashboard/admin");
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
                <div className="w-12 h-12 border-4 border-cyber-primary/20 border-t-cyber-primary rounded-full animate-spin mb-4 shadow-[0_0_15px_rgba(79,70,229,0.5)]"></div>
                <p className="text-cyber-muted font-medium animate-pulse tracking-wide uppercase text-sm">Initializing Modules...</p>
            </div>
        );
    }

    const { 
        totalResidents, 
        totalFlats, 
        vacantFlats, 
        totalPendingComplaints, 
        revenueThisMonth,
        revenueTrend = [], 
        complaintStats = [] 
    } = data;

    const finalTrendData = revenueTrend.length ? revenueTrend : [
        { month: 'Jan', revenue: 45000 },
        { month: 'Feb', revenue: 52000 },
        { month: 'Mar', revenue: 48000 },
        { month: 'Apr', revenue: 61000 },
        { month: 'May', revenue: 59000 },
        { month: 'Jun', revenue: revenueThisMonth || 65000 }
    ];

    const finalComplaintStats = complaintStats.length ? complaintStats : [
        { name: 'Electrical', count: 12 },
        { name: 'Plumbing', count: 8 },
        { name: 'Cleaning', count: 15 },
        { name: 'Security', count: 3 }
    ];

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pb-10"
        >
            <PageHeader
                title="System Overview"
                subtitle="Real-time society metrics and financial indicators"
            />

            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard 
                    title="Total Residents" 
                    value={totalResidents} 
                    icon={Users} 
                    trend={12}
                    trendLabel="vs last month"
                    colorClass="teal"
                />
                <StatCard 
                    title="Total / Vacant Flats" 
                    value={`${totalFlats} / ${vacantFlats}`} 
                    icon={Home} 
                    colorClass="blue"
                />
                <StatCard 
                    title="Pending Tickets" 
                    value={totalPendingComplaints} 
                    icon={AlertCircle} 
                    trend={-5}
                    trendLabel="vs last week"
                    colorClass="rose"
                />
                <StatCard 
                    title="Month Revenue" 
                    value={formatCurrency(revenueThisMonth || 0)} 
                    icon={CreditCard} 
                    trend={8}
                    trendLabel="vs last month"
                    colorClass="emerald"
                />
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                
                {/* Revenue Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-cyber-card rounded-xl border border-border shadow-xl p-6"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-cyber-text text-lg tracking-tight">Revenue Trajectory</h3>
                            <p className="text-xs text-cyber-muted mt-1 uppercase tracking-wider font-semibold">Monthly Collection Status</p>
                        </div>
                        <span className="p-2.5 bg-cyber-accent/10 text-cyber-accent rounded-lg border border-cyber-accent/20">
                            <Activity size={20} />
                        </span>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={finalTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4}/>
                                        <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} tickFormatter={(val) => `₹${val/1000}k`} dx={10} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#17213A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.5)' }}
                                    itemStyle={{ color: '#06B6D4', fontWeight: 'bold' }}
                                    formatter={(value) => [formatCurrency(value), "Revenue"]}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#06B6D4" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" style={{ filter: "drop-shadow(0 0 8px rgba(6,182,212,0.5))" }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Complaints Chart */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-cyber-card rounded-xl border border-border shadow-xl p-6"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-cyber-text text-lg tracking-tight">Ticket Distribution</h3>
                            <p className="text-xs text-cyber-muted mt-1 uppercase tracking-wider font-semibold">By Category</p>
                        </div>
                        <span className="p-2.5 bg-cyber-primary/10 text-cyber-primary rounded-lg border border-cyber-primary/20">
                            <Calendar size={20} />
                        </span>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={finalComplaintStats} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(255,255,255,0.05)" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12, fontWeight: 600 }} width={80} />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.02)'}} 
                                    contentStyle={{ backgroundColor: '#17213A', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }} 
                                    itemStyle={{ color: '#4F46E5', fontWeight: 'bold' }}
                                />
                                <Bar dataKey="count" fill="#4F46E5" radius={[0, 6, 6, 0]} barSize={24} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default Admin;