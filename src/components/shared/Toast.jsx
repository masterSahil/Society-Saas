import { useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

const Toast = ({ message, type = "info", onClose, duration = 3000 }) => {
    useEffect(() => {
        if (duration && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    if (!message) return null;

    const styles = {
        success: "bg-emerald-50 text-emerald-800 border-emerald-200",
        error: "bg-rose-50 text-rose-800 border-rose-200",
        warning: "bg-amber-50 text-amber-800 border-amber-200",
        info: "bg-blue-50 text-blue-800 border-blue-200",
    };

    const icons = {
        success: <CheckCircle2 className="text-emerald-500" size={20} />,
        error: <XCircle className="text-rose-500" size={20} />,
        warning: <AlertCircle className="text-amber-500" size={20} />,
        info: <Info className="text-blue-500" size={20} />,
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-sm ${styles[type]}`}>
                <div className="flex-shrink-0 mt-0.5">{icons[type]}</div>
                <div className="flex-1 text-sm font-medium pr-2">{message}</div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-stone-400 hover:text-stone-600 transition-colors"
                    >
                        <X size={16} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default Toast;
