/**
 * Trips Store Slice - شريحة إدارة الرحلات
 */
import { Trip } from '@/types';
import { mockTrips } from '@/data/mock-data';
import { generateId } from '@/lib/id';

export interface TripsState {
    trips: Trip[];
    loading: boolean;
    error: string | null;
}

export const initialTripsState: TripsState = {
    trips: mockTrips,
    loading: false,
    error: null,
};

export interface TripsActions {
    addTrip: (trip: Omit<Trip, 'id'>) => void;
    updateTrip: (id: string, data: Partial<Trip>) => void;
    deleteTrip: (id: string) => void;
}

export const createTripsSlice = (set: any) => ({
    ...initialTripsState,
    addTrip: (trip: Omit<Trip, 'id'>) =>
        set((state: TripsState) => ({ trips: [{ ...trip, id: generateId() }, ...state.trips] })),
    updateTrip: (id: string, data: Partial<Trip>) =>
        set((state: TripsState) => ({
            trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
        })),
    deleteTrip: (id: string) =>
        set((state: TripsState) => ({ trips: state.trips.filter((t) => t.id !== id) })),
});
