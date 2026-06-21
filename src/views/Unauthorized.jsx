"use client";
import { Link } from '@/lib/react-router-dom';
import { ShieldX, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-cyber-bg p-6 font-sans relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyber-bg via-cyber-surface to-cyber-bg" />
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center opacity-5 pointer-events-none" />
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center max-w-md relative z-10 glass-panel p-10 rounded-3xl border border-border shadow-[0_0_30px_rgba(244,63,94,0.3)]"
            >
                <div className="w-24 h-24 bg-[#f43f5e]/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-[#f43f5e]/30 shadow-[0_0_20px_rgba(244,63,94,0.3)]">
                    <ShieldX size={48} className="text-[#f43f5e] drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                </div>
                <h1 className="text-3xl font-extrabold text-cyber-text mb-4 tracking-tight">Access Denied</h1>
                <p className="text-cyber-muted mb-10 leading-relaxed font-medium">
                    You lack the required security clearance to access this sector.
                    Contact system administrator if you require elevation.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex items-center gap-2 bg-cyber-primary text-white px-8 py-3.5 rounded-lg hover:bg-[#4338ca] transition-all font-bold shadow-[0_0_15px_rgba(79,70,229,0.5)] tracking-wide uppercase text-sm"
                >
                    <ArrowLeft size={18} />
                    Return to Mainframe
                </Link>
            </motion.div>
        </div>
    );
};

export default Unauthorized;
