import { useState } from "react";

const usePagination = (initialPage = 1, initialLimit = 15) => {
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit) => {
        setLimit(newLimit);
        setPage(1); // Reset to first page when limit changes
    };

    const resetPagination = () => {
        setPage(initialPage);
    };

    return {
        page,
        limit,
        handlePageChange,
        handleLimitChange,
        resetPagination,
    };
};

export default usePagination;
