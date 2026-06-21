export const formatDate = (dateString, format = "medium") => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const options = {
        short: { month: "short", day: "numeric", year: "numeric" },
        medium: { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" },
        long: { weekday: "short", month: "long", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" },
        time: { hour: "2-digit", minute: "2-digit" },
    };

    return new Intl.DateTimeFormat("en-IN", options[format] || options.medium).format(date);
};

export const formatRelativeTime = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-";

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return formatDate(dateString, "short");
};
