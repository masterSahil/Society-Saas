/**
 * Extracts pagination and sort parameters from req.query.
 *
 * Query params accepted:
 *   page  – 1-indexed page number   (default: 1)
 *   limit – results per page         (default: 15, max: 100)
 *   sort  – Mongoose sort string     (default: "-createdAt")
 *
 * @returns {{ skip: number, limit: number, sort: string, page: number }}
 */
const buildPagination = (query) => {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit, 10) || 15));
    const skip = (page - 1) * limit;
    const sort = query.sort || "-createdAt";

    return { skip, limit, sort, page };
};

/**
 * Builds a pagination metadata object for API responses.
 *
 * @param {number} total  – total number of documents
 * @param {number} page   – current page
 * @param {number} limit  – results per page
 */
const paginationMeta = (total, page, limit) => ({
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasNextPage: page * limit < total,
    hasPrevPage: page > 1,
});

module.exports = { buildPagination, paginationMeta };
