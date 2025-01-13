import { useState, useCallback } from 'react';

interface UseApiStatusResult {
    isLoading: boolean;
    error: string | null;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    handleApiCall: <T>(apiCall: () => Promise<T>) => Promise<T | null>;
}

export const useApiStatus = (): UseApiStatusResult => {
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleApiCall = useCallback(async <T>(apiCall: () => Promise<T>): Promise<T | null> => {
        setLoading(true);
        setError(null);
        try {
            const result = await apiCall();
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMessage);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        isLoading,
        error,
        setLoading,
        setError,
        handleApiCall,
    };
}; 