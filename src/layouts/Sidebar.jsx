"use client";
import { NavLink } from '@/lib/react-router-dom';
import { X, LogOut, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { getMenuForRole, getRoleLabel } from "../utils/roleConfig";

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
    const { user, logout } = useAuth();

    if (!user) return null;

    const menuItems = getMenuForRole(user.role);

    const handleLogout = () => {
        logout();
        onClose();
    };

    return (
        <>
            {/* Mobile overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-cyber-bg/80 backdrop-blur-sm z-40 lg:hidden"
                        onClick={onClose}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <aside className={`
                    fixed top-0 left-0 z-50 h-full lg:h-[calc(100vh-2rem)] lg:my-4 lg:ml-4 bg-cyber-surface text-cyber-text
                    flex flex-col transition-all duration-300 ease-in-out lg:rounded-xl border-r lg:border border-border shadow-2xl
                    ${isCollapsed ? "lg:w-20" : "lg:w-64"}
                    ${isOpen ? "w-64 translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:static
                `} >
                {/* Header */}
                <div className={`flex items-center border-b border-border ${isCollapsed ? "px-4 py-6 justify-center" : "px-6 py-6 justify-between"}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-cyber-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                <svg className="w-5 h-5 text-cyber-text" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83L17.17 10H6.83L12 4.83zM10 18v-4h4v4h-4z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="font-bold text-sm tracking-widest text-cyber-text uppercase">Society</h1>
                                <p className="text-[10px] text-cyber-accent uppercase tracking-widest font-semibold">{getRoleLabel(user.role)}</p>
                            </div>
                        </div>
                    )}

                    {isCollapsed && (
                        <div className="w-10 h-10 bg-cyber-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                            <svg className="w-5 h-5 text-cyber-text" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2L2 12h3v8h14v-8h3L12 2zm0 2.83L17.17 10H6.83L12 4.83zM10 18v-4h4v4h-4z" />
                            </svg>
                        </div>
                    )}

                    {/* Mobile close button */}
                    <button
                        onClick={onClose}
                        className="lg:hidden p-1.5 rounded-lg hover:bg-cyber-text/10 text-cyber-muted transition-colors"
                    >
                        <X size={18} />
                    </button>

                    {/* Desktop collapse button */}
                    {!isCollapsed && (
                        <button
                            onClick={onToggleCollapse}
                            className="hidden lg:flex p-1.5 rounded-lg hover:bg-cyber-text/10 text-cyber-muted transition-colors"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-6 px-3">
                    <ul className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <li key={item.path}>
                                    <NavLink
                                        to={item.path}
                                        onClick={onClose}
                                        className={({ isActive }) =>
                                            `relative flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 group overflow-hidden
                                            ${isActive
                                                ? "text-cyber-primary shadow-[inset_3px_0_0_currentColor]"
                                                : "text-cyber-muted hover:bg-cyber-text/5 hover:text-cyber-text"
                                            }
                                            ${isCollapsed ? "justify-center" : ""}`
                                        }
                                        title={isCollapsed ? item.label : undefined}
                                    >
                                        {({ isActive }) => (
                                            <>
                                                {isActive && (
                                                    <motion.div 
                                                        layoutId="active-nav-indicator"
                                                        className="absolute inset-0 bg-cyber-primary/10"
                                                        initial={false}
                                                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                                    />
                                                )}
                                                <Icon size={18} className={`relative z-10 flex-shrink-0 ${isActive ? 'text-cyber-primary drop-shadow-[0_0_8px_rgba(79,70,229,0.8)]' : ''}`} />
                                                {!isCollapsed && <span className="relative z-10">{item.label}</span>}
                                            </>
                                        )}
                                    </NavLink>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Footer — User + Logout */}
                <div className={`border-t border-border ${isCollapsed ? "p-3 py-4" : "p-5"}`}>
                    {!isCollapsed && (
                        <div className="flex items-center gap-3 mb-4 px-1">
                            <div className="w-10 h-10 rounded-full bg-cyber-card flex items-center justify-center text-sm font-bold text-cyber-accent uppercase border border-border">
                                {user.name?.charAt(0) || "U"}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-cyber-text truncate">{user.name}</p>
                                <p className="text-xs text-cyber-muted truncate">{user.email}</p>
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-cyber-muted hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 ${isCollapsed ? "justify-center" : ""}`}
                        title={isCollapsed ? "Logout" : undefined}
                    >
                        <LogOut size={18} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
