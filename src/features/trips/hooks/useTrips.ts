/**
 * Trips Feature Hook - خطاف إدارة الرحلات
 * فصل منطق الأعمال عن مكون العرض
 */

import { useState, useCallback, useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { validate } from '@/lib/validation';
import { tripSchema } from '@/lib/validation';
import { generateId } from '@/lib/id';
import { Trip } from '@/types';

/**
 * فلتر الرحلات
 */
export interface TripFilters {
    search: string;
    status: string;
    country: string;
}

/**
 * Hook لإدارة الرحلات
 */
export function useTrips() {
    const { trips, addTrip, updateTrip, deleteTrip } = useAppStore();

    const [filters, setFilters] = useState<TripFilters>({
        search: '',
        status: 'all',
        country: 'all',
    });

    // استخراج الدول الفريدة
    const countries = useMemo(
        () => [...new Set(trips.map((t) => t.country))],
        [trips]
    );

    // فلترة الرحلات
    const filteredTrips = useMemo(() => {
        return trips.filter((trip) => {
            const matchesSearch =
                filters.search === '' ||
                trip.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                trip.city.toLowerCase().includes(filters.search.toLowerCase());

            const matchesStatus =
                filters.status === 'all' || trip.status === filters.status;

            const matchesCountry =
                filters.country === 'all' || trip.country === filters.country;

            return matchesSearch && matchesStatus && matchesCountry;
        });
    }, [trips, filters]);

    // الإحصائيات
    const stats = useMemo(
        () => ({
            total: trips.length,
            planning: trips.filter((t) => t.status === 'planning').length,
            active: trips.filter((t) => t.status === 'active').length,
            completed: trips.filter((t) => t.status === 'completed').length,
        }),
        [trips]
    );

    // إضافة رحلة جديدة
    const createTrip = useCallback(
        async (data: Omit<Trip, 'id' | 'status'>) => {
            const validation = validate(tripSchema, data);

            if (!validation.isValid) {
                const errorMessages = validation.errors.map((e) => e.message).join(', ');
                throw new Error(errorMessages);
            }

            const newTrip: Trip = {
                ...data,
                id: generateId(),
                status: 'planning',
            };

            addTrip(newTrip);
            return newTrip;
        },
        [addTrip]
    );

    // تحديث رحلة
    const editTrip = useCallback(
        async (id: string, data: Partial<Trip>) => {
            updateTrip(id, data);
        },
        [updateTrip]
    );

    // حذف رحلة
    const removeTrip = useCallback(
        async (id: string) => {
            deleteTrip(id);
        },
        [deleteTrip]
    );

    // تحديث الفلاتر
    const updateFilters = useCallback((newFilters: Partial<TripFilters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    }, []);

    // إعادة تعيين الفلاتر
    const resetFilters = useCallback(() => {
        setFilters({ search: '', status: 'all', country: 'all' });
    }, []);

    return {
        // البيانات
        trips: filteredTrips,
        allTrips: trips,
        totalCount: trips.length,

        // الإحصائيات
        stats,

        // الفلاتر
        filters,
        countries,
        updateFilters,
        resetFilters,

        // الإجراءات
        createTrip,
        editTrip,
        removeTrip,
    };
}

export default useTrips;
