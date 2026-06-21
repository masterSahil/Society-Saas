import React from "react";
import Modal from "./Modal";
import { AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isDestructive = false,
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
            <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className={`p-3 rounded-xl flex-shrink-0 border ${
                    isDestructive 
                        ? "bg-[#f43f5e]/10 text-[#f43f5e] border-[#f43f5e]/20 shadow-[0_0_15px_rgba(244,63,94,0.3)]" 
                        : "bg-cyber-primary/10 text-cyber-primary border-cyber-primary/20 shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                }`}>
                    {isDestructive ? <AlertTriangle size={24} /> : <Info size={24} />}
                </div>
                <div>
                    <p className="text-cyber-muted text-sm leading-relaxed">{message}</p>
                </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
                <button
                    onClick={onClose}
                    className="px-5 py-2.5 rounded-lg border border-border text-cyber-muted hover:bg-cyber-text/5 hover:text-cyber-text transition-all font-semibold tracking-wide text-sm"
                >
                    {cancelText}
                </button>
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onConfirm}
                    className={`px-5 py-2.5 rounded-lg text-cyber-text font-bold tracking-wide text-sm transition-all shadow-lg ${
                        isDestructive
                            ? "bg-[#f43f5e] hover:bg-[#e11d48] shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                            : "bg-cyber-primary hover:bg-[#4338ca] shadow-[0_0_15px_rgba(79,70,229,0.5)]"
                    }`}
                >
                    {confirmText}
                </motion.button>
            </div>
        </Modal>
    );
};

export default ConfirmDialog;
