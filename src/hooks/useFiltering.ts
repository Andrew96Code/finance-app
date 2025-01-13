import { useState, useMemo } from 'react';

type FilterValue = string | number | boolean | null;

interface FilterConfig<T> {
    [key: string]: {
        value: FilterValue;
        predicate?: (itemValue: any, filterValue: FilterValue) => boolean;
    };
}

interface UseFilteringResult<T> {
    filteredData: T[];
    filterConfig: FilterConfig<T>;
    setFilter: (key: string, value: FilterValue, predicate?: (itemValue: any, filterValue: FilterValue) => boolean) => void;
    clearFilter: (key: string) => void;
    clearAllFilters: () => void;
}

const defaultPredicate = (itemValue: any, filterValue: FilterValue): boolean => {
    if (filterValue === null || filterValue === undefined) return true;
    if (typeof itemValue === 'string' && typeof filterValue === 'string') {
        return itemValue.toLowerCase().includes(filterValue.toLowerCase());
    }
    return itemValue === filterValue;
};

export const useFiltering = <T extends object>(
    data: T[],
    initialFilters: FilterConfig<T> = {}
): UseFilteringResult<T> => {
    const [filterConfig, setFilterConfig] = useState<FilterConfig<T>>(initialFilters);

    const filteredData = useMemo(() => {
        return data.filter((item) => {
            return Object.entries(filterConfig).every(([key, config]) => {
                if (config.value === null || config.value === undefined) return true;

                const itemValue = (item as any)[key];
                const predicate = config.predicate || defaultPredicate;

                return predicate(itemValue, config.value);
            });
        });
    }, [data, filterConfig]);

    const setFilter = (
        key: string,
        value: FilterValue,
        predicate?: (itemValue: any, filterValue: FilterValue) => boolean
    ) => {
        setFilterConfig((prev) => ({
            ...prev,
            [key]: { value, predicate },
        }));
    };

    const clearFilter = (key: string) => {
        setFilterConfig((prev) => {
            const newConfig = { ...prev };
            delete newConfig[key];
            return newConfig;
        });
    };

    const clearAllFilters = () => {
        setFilterConfig({});
    };

    return {
        filteredData,
        filterConfig,
        setFilter,
        clearFilter,
        clearAllFilters,
    };
}; 