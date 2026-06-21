import React from "react";
import Loader from "./Loader";
import EmptyState from "./EmptyState";
import Pagination from "./Pagination";
import { motion } from "framer-motion";

const DataTable = ({
    columns,
    data,
    isLoading,
    emptyIcon,
    emptyTitle,
    emptyMessage,
    pagination,
    onPageChange,
    onRowClick,
    viewMode = 'table',
}) => {
    if (isLoading) {
        return (
            <div className="bg-cyber-card border border-border rounded-xl shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <div className="min-h-[400px] flex items-center justify-center relative z-10">
                    <Loader size="md" />
                </div>
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="bg-cyber-card border border-border rounded-xl shadow-xl overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                <EmptyState icon={emptyIcon} title={emptyTitle} message={emptyMessage} />
            </div>
        );
    }

    const renderCellContent = (col, row) => {
        const content = col.cell ? col.cell(row) : row[col.accessor];
        if (content === null || content === undefined || content === '') return <span className="text-cyber-muted/50">-</span>;
        return content;
    };

    return (
        <div className="flex flex-col gap-5">
            {viewMode === 'table' ? (
                <div className="bg-cyber-card border border-border rounded-xl shadow-xl flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="overflow-x-auto relative z-10">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="bg-cyber-text/5 border-b border-border text-cyber-muted font-bold tracking-wider uppercase text-xs">
                                <tr>
                                    {columns.map((col, index) => (
                                        <th
                                            key={index}
                                            className={`px-6 py-5 ${col.className || ""}`}
                                            style={col.style}
                                        >
                                            {col.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-cyber-text">
                                {data.map((row, rowIndex) => (
                                    <motion.tr
                                        whileHover={{ backgroundColor: "rgba(255,255,255,0.03)" }}
                                        key={row._id || rowIndex}
                                        onClick={() => onRowClick && onRowClick(row)}
                                        className={`transition-colors group ${
                                            onRowClick ? "cursor-pointer" : ""
                                        }`}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className={`px-6 py-5 ${col.cellClassName || ""}`}
                                            >
                                                {renderCellContent(col, row)}
                                            </td>
                                        ))}
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {data.map((row, rowIndex) => (
                        <motion.div 
                            whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.03)" }}
                            key={row._id || rowIndex}
                            onClick={() => onRowClick && onRowClick(row)}
                            className={`bg-cyber-card border border-border p-6 rounded-xl shadow-xl flex flex-col gap-4 relative overflow-hidden group ${onRowClick ? "cursor-pointer hover:border-cyber-primary/50 hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]" : ""}`}
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-text/5 rounded-full blur-[40px] -mr-8 -mt-8 pointer-events-none group-hover:bg-cyber-primary/10 transition-colors" />
                            {columns.map((col, colIndex) => {
                                const content = renderCellContent(col, row);
                                if (col.header === "Actions" && (!content || content.type === React.Fragment)) return null;

                                return (
                                    <div key={colIndex} className={`flex flex-col relative z-10 ${col.header === 'Actions' ? 'mt-auto pt-4 border-t border-border items-center justify-center w-full' : ''}`}>
                                        {col.header !== "Actions" && (
                                            <span className="text-[10px] font-bold text-cyber-muted uppercase tracking-widest mb-1.5">{col.header}</span>
                                        )}
                                        <div className="text-sm text-cyber-text font-medium">
                                            {content}
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    ))}
                </div>
            )}

            {pagination && (
                <div className="bg-cyber-card border border-border rounded-xl shadow-xl overflow-hidden mt-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                    <div className="relative z-10">
                        <Pagination pagination={pagination} onPageChange={onPageChange} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataTable;
