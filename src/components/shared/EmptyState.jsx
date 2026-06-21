import React from "react";

const EmptyState = ({ icon: Icon, title, message, action }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center relative z-10">
            {Icon && (
                <div className="w-20 h-20 bg-cyber-text/5 rounded-3xl flex items-center justify-center mb-6 border border-border shadow-[0_0_20px_rgba(255,255,255,0.05)]">
                    <Icon size={32} className="text-cyber-muted" />
                </div>
            )}
            <h3 className="text-xl font-bold text-cyber-text mb-2 tracking-tight">{title}</h3>
            <p className="text-sm text-cyber-muted max-w-sm mb-8 leading-relaxed">{message}</p>
            {action && (
                <div className="mt-2">
                    {action}
                </div>
            )}
        </div>
    );
};

export default EmptyState;
