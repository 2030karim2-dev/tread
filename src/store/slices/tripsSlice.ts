import type { StateCreator } from 'zustand';
import type { Trip } from '@/types';
import { mockTrips } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

export interface TripsSlice {
  trips: Trip[];
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
}

export const createTripsSlice: StateCreator<TripsSlice> = (set) => ({
  trips: mockTrips,
  addTrip: (trip) =>
    set((state) => ({ trips: [{ ...trip, id: generateId() }, ...state.trips] })),
  updateTrip: (id, data) =>
    set((state) => ({ trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
  deleteTrip: (id) =>
    set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),
});
