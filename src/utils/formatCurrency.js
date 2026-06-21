export const formatCurrency = (amount, currency = "INR") => {
    if (amount === null || amount === undefined || isNaN(amount)) return "-";

    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(amount);
};
