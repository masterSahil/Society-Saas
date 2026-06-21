import React from "react";

const Loader = ({ fullScreen = false, size = "md", text = "Loading..." }) => {
    const sizeClasses = {
        sm: "w-5 h-5 border-2",
        md: "w-8 h-8 border-3",
        lg: "w-12 h-12 border-4",
    };

    const loaderContent = (
        <div className="flex flex-col items-center justify-center gap-3 animate-in fade-in duration-300">
            <div
                className={`${sizeClasses[size]} border-teal-600/30 border-t-teal-600 rounded-full animate-spin`}
            />
            {text && <p className="text-sm font-medium text-stone-500 animate-pulse">{text}</p>}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-stone-50/80 backdrop-blur-sm z-50 flex items-center justify-center">
                {loaderContent}
            </div>
        );
    }

    return <div className="p-8 flex justify-center w-full">{loaderContent}</div>;
};

export default Loader;
