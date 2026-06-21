import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

const Pagination = ({ pagination, onPageChange }) => {
    const { page, totalPages, total, limit } = pagination;

    if (totalPages <= 1) return null;

    const startItem = (page - 1) * limit + 1;
    const endItem = Math.min(page * limit, total);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);
            if (page > 3) pages.push("...");

            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);

            if (page === 1) end = 3;
            if (page === totalPages) start = totalPages - 2;

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (page < totalPages - 2) pages.push("...");
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-cyber-card border-t border-border">
            <div className="text-sm text-cyber-muted mb-4 sm:mb-0 font-medium">
                Showing <span className="font-bold text-cyber-text">{startItem}</span> to <span className="font-bold text-cyber-text">{endItem}</span> of <span className="font-bold text-cyber-text">{total}</span> records
            </div>

            <div className="flex items-center gap-2">
                <motion.button
                    whileHover={page > 1 ? { scale: 1.05 } : {}}
                    whileTap={page > 1 ? { scale: 0.95 } : {}}
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-border text-cyber-muted hover:bg-cyber-text/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronLeft size={18} />
                </motion.button>

                <div className="flex items-center gap-1">
                    {getPageNumbers().map((pageNum, idx) => (
                        <React.Fragment key={idx}>
                            {pageNum === "..." ? (
                                <span className="px-2 text-cyber-muted">
                                    <MoreHorizontal size={16} />
                                </span>
                            ) : (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onPageChange(pageNum)}
                                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                                        page === pageNum
                                            ? "bg-cyber-primary text-white border border-cyber-primary/50 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                                            : "border border-transparent text-cyber-muted hover:bg-cyber-text/5 hover:text-cyber-text"
                                    }`}
                                >
                                    {pageNum}
                                </motion.button>
                            )}
                        </React.Fragment>
                    ))}
                </div>

                <motion.button
                    whileHover={page < totalPages ? { scale: 1.05 } : {}}
                    whileTap={page < totalPages ? { scale: 0.95 } : {}}
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-border text-cyber-muted hover:bg-cyber-text/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                    <ChevronRight size={18} />
                </motion.button>
            </div>
        </div>
    );
};

export default Pagination;
