import { useState, useCallback } from "react";
import api from "../config/api";

const useApi = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (method, url, data = undefined, params = undefined, config = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api({
                method,
                url,
                ...(data !== undefined && { data }),
                ...(params !== undefined && { params }),
                ...config,
            });
            return response.data;
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "An unexpected error occurred";
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const get = useCallback((url, params = undefined, config = {}) => request("GET", url, undefined, params, config), [request]);
    const post = useCallback((url, data = undefined, config = {}) => request("POST", url, data, undefined, config), [request]);
    const put = useCallback((url, data = undefined, config = {}) => request("PUT", url, data, undefined, config), [request]);
    const del = useCallback((url, config = {}) => request("DELETE", url, undefined, undefined, config), [request]);

    return { 
        isLoading, error, get, post, put, del, setError,
    };
};

export default useApi;
