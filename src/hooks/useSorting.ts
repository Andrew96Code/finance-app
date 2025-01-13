import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
    key: keyof T;
    direction: SortDirection;
}

interface UseSortingResult<T> {
    sortedData: T[];
    sortConfig: SortConfig<T> | null;
    requestSort: (key: keyof T) => void;
    getSortDirection: (key: keyof T) => SortDirection | undefined;
}

export const useSorting = <T extends object>(
    data: T[],
    defaultSort?: SortConfig<T>
): UseSortingResult<T> => {
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(defaultSort || null);

    const sortedData = useMemo(() => {
        if (!sortConfig) return data;

        return [...data].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (aValue === bValue) return 0;

            if (sortConfig.direction === 'asc') {
                return aValue < bValue ? -1 : 1;
            } else {
                return aValue > bValue ? -1 : 1;
            }
        });
    }, [data, sortConfig]);

    const requestSort = (key: keyof T) => {
        let direction: SortDirection = 'asc';

        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }

        setSortConfig({ key, direction });
    };

    const getSortDirection = (key: keyof T): SortDirection | undefined => {
        if (!sortConfig || sortConfig.key !== key) return undefined;
        return sortConfig.direction;
    };

    return {
        sortedData,
        sortConfig,
        requestSort,
        getSortDirection,
    };
}; 