import { useState, useMemo } from 'react';

interface UsePaginationProps<T> {
    data: T[];
    itemsPerPage: number;
}

interface UsePaginationResult<T> {
    currentPage: number;
    totalPages: number;
    currentData: T[];
    goToPage: (page: number) => void;
    nextPage: () => void;
    previousPage: () => void;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export const usePagination = <T>({
    data,
    itemsPerPage,
}: UsePaginationProps<T>): UsePaginationResult<T> => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const currentData = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        return data.slice(start, end);
    }, [data, currentPage, itemsPerPage]);

    const goToPage = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    };

    const nextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const previousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    return {
        currentPage,
        totalPages,
        currentData,
        goToPage,
        nextPage,
        previousPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
    };
}; 