/**
 * useFilteredList Hook - خطاف القائمة المفلترة
 * خطاف قابل لإعادة الاستخدام للفلترة والبحث
 */

import { useState, useMemo, useCallback } from 'react';

export interface FilterOption {
    value: string;
    label: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    options: FilterOption[];
}

/**
 * خطاف للفلترة والبحث
 * @param items - العناصر المراد فلترتها
 * @param searchKeys - المفاتيح التي يتم البحث فيها
 */
export function useFilteredList<T>(
    items: T[],
    searchKeys: (keyof T)[]
) {
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState<Record<string, string>>({});

    // فلترة العناصر
    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            // البحث
            const matchesSearch =
                search === '' ||
                searchKeys.some((key) => {
                    const value = item[key];
                    if (typeof value === 'string') {
                        return value.toLowerCase().includes(search.toLowerCase());
                    }
                    return false;
                });

            // الفلاتر الأخرى
            const matchesFilters = Object.entries(filters).every(([key, value]) => {
                if (value === 'all' || value === '') return true;
                const itemValue = item[key as keyof T];
                return String(itemValue) === value;
            });

            return matchesSearch && matchesFilters;
        });
    }, [items, search, searchKeys, filters]);

    // تحديث فلتر واحد
    const updateFilter = useCallback((key: string, value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    }, []);

    // إعادة تعيين كل الفلاتر
    const resetFilters = useCallback(() => {
        setSearch('');
        setFilters({});
    }, []);

    // التحقق من وجود نتائج
    const hasResults = filteredItems.length > 0;
    const hasActiveFilters = search !== '' || Object.values(filters).some((v) => v !== 'all' && v !== '');

    return {
        // البيانات
        items: filteredItems,
        totalCount: items.length,
        filteredCount: filteredItems.length,

        // البحث
        search,
        setSearch,

        // الفلاتر
        filters,
        updateFilter,
        resetFilters,

        // الحالة
        hasResults,
        hasActiveFilters,
        isFiltering: hasActiveFilters,
    };
}

/**
 * استخراج القيم الفريدة من مصفوفة
 */
export function useUniqueValues<T, K extends keyof T>(
    items: T[],
    key: K
): { value: string; label: string }[] {
    return useMemo(() => {
        const unique = [...new Set(items.map((item) => String(item[key])))];
        return unique.map((value) => ({ value, label: value }));
    }, [items, key]);
}

export default useFilteredList;
