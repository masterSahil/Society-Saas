"use client";
import { useState, useEffect, useRef } from "react";
import { Link } from '@/lib/react-router-dom';
import { Menu, Bell, ChevronRight, User, Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getRoleLabel } from "../utils/roleConfig";
import api from "../config/api";

const Header = ({ onMenuToggle, onExpandSidebar, isCollapsed }) => {
    const { user } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [unreadCount, setUnreadCount] = useState(0);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileRef = useRef(null);

    // Fetch unread notification count
    useEffect(() => {
        const fetchUnread = async () => {
            try {
                const res = await api.get("/notifications?isRead=false&limit=1");
                setUnreadCount(res.data.data.unreadCount || 0);
            } catch {
                // Fail silently
            }
        };

        fetchUnread();
        const interval = setInterval(fetchUnread, 60000);
        return () => clearInterval(interval);
    }, []);

    // Close profile menu on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setShowProfileMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, []);

    return (
        <header className="sticky top-0 z-30 bg-cyber-bg/90 backdrop-blur-md px-4 sm:px-6 py-4 lg:py-6 border-b border-border shadow-sm">
            <div className="flex items-center justify-between">
                {/* Left side */}
                <div className="flex items-center gap-3">
                    {/* Mobile menu toggle */}
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                    >
                        <Menu size={20} />
                    </button>

                    {/* Desktop sidebar expand (when collapsed) */}
                    {isCollapsed && (
                        <button
                            onClick={onExpandSidebar}
                            className="hidden lg:flex p-2 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-text transition-colors"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>

                {/* Right side */}
                <div className="flex items-center gap-3 sm:gap-5">
                    {/* Theme Toggle */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className="p-2.5 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-primary hover:border-cyber-primary/30 transition-all flex items-center justify-center overflow-hidden"
                        title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
                    >
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={theme}
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: 20, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </motion.div>
                        </AnimatePresence>
                    </motion.button>

                    {/* Notification bell */}
                    <Link to="/notifications"
                        className="relative p-2.5 rounded-lg bg-cyber-surface border border-border text-cyber-muted hover:text-cyber-accent hover:border-cyber-accent/30 transition-all group" >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-cyber-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-md">
                                {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                        )}
                    </Link>

                    {/* Profile dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex items-center gap-2 sm:gap-3 p-1.5 sm:pr-4 rounded-full bg-cyber-surface border border-border hover:border-cyber-primary/30 transition-all"
                        >
                            <div className="w-9 h-9 rounded-full bg-cyber-primary flex items-center justify-center text-white text-sm font-bold uppercase shadow-md">
                                {user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="hidden sm:block text-left mr-1">
                                <p className="text-sm font-semibold text-cyber-text leading-tight tracking-wide">{user?.name}</p>
                                <p className="text-[10px] text-cyber-muted leading-tight uppercase tracking-wider">{getRoleLabel(user?.role)}</p>
                            </div>
                        </button>

                        {/* Dropdown */}
                        <AnimatePresence>
                            {showProfileMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="absolute right-0 mt-3 w-56 bg-cyber-surface rounded-xl shadow-xl border border-border py-2 z-50 overflow-hidden"
                                >
                                    <div className="px-5 py-3 border-b border-border">
                                        <p className="text-sm font-semibold text-cyber-text">{user?.name}</p>
                                        <p className="text-xs text-cyber-muted truncate">{user?.email}</p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        onClick={() => setShowProfileMenu(false)}
                                        className="flex items-center gap-3 px-5 py-3 text-sm text-cyber-muted hover:bg-cyber-text/5 hover:text-cyber-text transition-colors"
                                    >
                                        <User size={16} />
                                        My Profile
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
