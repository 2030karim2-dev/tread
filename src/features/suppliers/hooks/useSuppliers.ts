/**
 * Suppliers Feature Hook - خطاف إدارة الموردين
 * فصل منطق الأعمال عن مكون العرض
 */

import { useState, useCallback, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { validate } from '@/lib/validation';
import { supplierSchema } from '@/lib/validation';
import { generateId } from '@/lib/id';
import { Supplier } from '@/types';

/**
 * فلتر الموردين
 */
export interface SupplierFilters {
    search: string;
    category: string;
    city: string;
}

/**
 * Hook لإدارة الموردين
 */
export function useSuppliers() {
    const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAppStore();

    const [filters, setFilters] = useState<SupplierFilters>({
        search: '',
        category: 'all',
        city: 'all',
    });

    // استخراج الفئات والمدن الفريدة
    const categories = useMemo(
        () => [...new Set(suppliers.map((s) => s.product_category))],
        [suppliers]
    );

    const cities = useMemo(
        () => [...new Set(suppliers.map((s) => s.city))],
        [suppliers]
    );

    // فلترة الموردين
    const filteredSuppliers = useMemo(() => {
        return suppliers.filter((supplier) => {
            const matchesSearch =
                filters.search === '' ||
                supplier.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                supplier.company_name.toLowerCase().includes(filters.search.toLowerCase()) ||
                supplier.city.toLowerCase().includes(filters.search.toLowerCase());

            const matchesCategory =
                filters.category === 'all' || supplier.product_category === filters.category;

            const matchesCity =
                filters.city === 'all' || supplier.city === filters.city;

            return matchesSearch && matchesCategory && matchesCity;
        });
    }, [suppliers, filters]);

    // إضافة مورد جديد
    const createSupplier = useCallback(
        async (data: Omit<Supplier, 'id' | 'rating'>) => {
            const validation = validate(supplierSchema, data);

            if (!validation.isValid) {
                const errorMessages = validation.errors.map((e) => e.message).join(', ');
                throw new Error(errorMessages);
            }

            const newSupplier: Supplier = {
                ...data,
                id: generateId(),
                rating: 0,
            };

            addSupplier(newSupplier);
            return newSupplier;
        },
        [addSupplier]
    );

    // تحديث مورد
    const editSupplier = useCallback(
        async (id: string, data: Partial<Supplier>) => {
            updateSupplier(id, data);
        },
        [updateSupplier]
    );

    // حذف مورد
    const removeSupplier = useCallback(
        async (id: string) => {
            deleteSupplier(id);
        },
        [deleteSupplier]
    );

    // تحديث الفلاتر
    const updateFilters = useCallback((newFilters: Partial<SupplierFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    // إعادة تعيين الفلاتر
    const resetFilters = useCallback(() => {
        setFilters({ search: '', category: 'all', city: 'all' });
    }, []);

    return {
        // البيانات
        suppliers: filteredSuppliers,
        totalCount: suppliers.length,

        // الفلاتر
        filters,
        categories,
        cities,
        updateFilters,
        resetFilters,

        // الإجراءات
        createSupplier,
        editSupplier,
        removeSupplier,
    };
}

export default useSuppliers;
