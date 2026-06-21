import React from "react";
import { motion } from "framer-motion";

const PageHeader = ({ title, subtitle, actions, breadcrumbs }) => {
    return (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
            >
                {/* Optional Breadcrumbs */}
                {breadcrumbs && (
                    <nav className="flex items-center text-xs font-semibold text-cyber-muted mb-2 tracking-widest uppercase">
                        {breadcrumbs.map((crumb, idx) => (
                            <React.Fragment key={idx}>
                                {idx > 0 && <span className="mx-2 opacity-30">/</span>}
                                <span className={idx === breadcrumbs.length - 1 ? "text-cyber-accent" : ""}>
                                    {crumb.label}
                                </span>
                            </React.Fragment>
                        ))}
                    </nav>
                )}

                <h1 className="text-3xl sm:text-4xl font-extrabold text-cyber-text tracking-tight">
                    {title}
                </h1>
                {subtitle && <p className="text-cyber-muted text-sm mt-2 max-w-2xl">{subtitle}</p>}
            </motion.div>

            {actions && (
                <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex items-center gap-3"
                >
                    {actions}
                </motion.div>
            )}
        </div>
    );
};

export default PageHeader;
