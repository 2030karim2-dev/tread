/**
 * useCRUD Hook - خطاف العمليات الأساسية
 * خطاف قابل لإعادة الاستخدام للـ CRUD operations
 */

import { useState, useCallback } from 'react';
import { generateId } from '@/lib/id';

export interface CRUDState<T> {
    items: T[];
    loading: boolean;
    error: string | null;
}

export interface UseCRUDOptions<T> {
    initialItems?: T[];
    onCreate?: (item: T) => void | Promise<void>;
    onUpdate?: (id: string, data: Partial<T>) => void | Promise<void>;
    onDelete?: (id: string) => void | Promise<void>;
    idField?: keyof T;
}

/**
 * خطاف للـ CRUD operations
 */
export function useCRUD<T extends Record<string, unknown>>(
    options: UseCRUDOptions<T> = {}
) {
    const {
        initialItems = [],
        onCreate,
        onUpdate,
        onDelete,
        idField = 'id' as keyof T,
    } = options;

    const [state, setState] = useState<CRUDState<T>>({
        items: initialItems,
        loading: false,
        error: null,
    });

    // إنشاء عنصر جديد
    const create = useCallback(
        async (data: Omit<T, typeof idField>) => {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const newItem = {
                    ...data,
                    [idField]: generateId() as T[typeof idField],
                } as T;

                setState((prev) => ({
                    ...prev,
                    items: [newItem, ...prev.items],
                    loading: false,
                }));

                if (onCreate) {
                    await onCreate(newItem);
                }

                return newItem;
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'خطأ في الإنشاء';
                setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
                throw error;
            }
        },
        [idField, onCreate]
    );

    // تحديث عنصر موجود
    const update = useCallback(
        async (id: string, data: Partial<T>) => {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                setState((prev) => ({
                    ...prev,
                    items: prev.items.map((item) =>
                        item[idField] === id ? { ...item, ...data } : item
                    ),
                    loading: false,
                }));

                if (onUpdate) {
                    await onUpdate(id, data);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'خطأ في التحديث';
                setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
                throw error;
            }
        },
        [idField, onUpdate]
    );

    // حذف عنصر
    const remove = useCallback(
        async (id: string) => {
            setState((prev) => ({ ...prev, loading: true, error: null }));
            try {
                setState((prev) => ({
                    ...prev,
                    items: prev.items.filter((item) => item[idField] !== id),
                    loading: false,
                }));

                if (onDelete) {
                    await onDelete(id);
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'خطأ في الحذف';
                setState((prev) => ({ ...prev, loading: false, error: errorMessage }));
                throw error;
            }
        },
        [idField, onDelete]
    );

    // الحصول على عنصر بالمعرف
    const getById = useCallback(
        (id: string): T | undefined => {
            return state.items.find((item) => item[idField] === id);
        },
        [state.items, idField]
    );

    // إعادة تعيين العناصر
    const setItems = useCallback((items: T[]) => {
        setState((prev) => ({ ...prev, items }));
    }, []);

    // مسح الخطأ
    const clearError = useCallback(() => {
        setState((prev) => ({ ...prev, error: null }));
    }, []);

    return {
        // البيانات
        items: state.items,
        loading: state.loading,
        error: state.error,

        // الإجراءات
        create,
        update,
        remove,
        getById,
        setItems,
        clearError,
    };
}

/**
 * خطاف للـ Async CRUD مع التخزين المؤقت
 */
export function useAsyncCRUD<T extends Record<string, unknown>>(
    fetchFn: () => Promise<T[]>,
    options: UseCRUDOptions<T> = {}
) {
    const crud = useCRUD<T>(options);
    const [initialLoading, setInitialLoading] = useState(true);

    // جلب البيانات
    const fetch = useCallback(async () => {
        setInitialLoading(true);
        try {
            const data = await fetchFn();
            crud.setItems(data);
        } catch (error) {
            console.error('Error fetching:', error);
        } finally {
            setInitialLoading(false);
        }
    }, [fetchFn, crud.setItems]);

    // تحميل البيانات الأولية
    React.useEffect(() => {
        fetch();
    }, [fetch]);

    return {
        ...crud,
        loading: initialLoading || crud.loading,
        refresh: fetch,
    };
}

import React from 'react';

export default useCRUD;
