import type { StateCreator } from 'zustand';
import type { Supplier } from '@/types';
import { mockSuppliers } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

export interface SuppliersSlice {
  suppliers: Supplier[];
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;
}

export const createSuppliersSlice: StateCreator<SuppliersSlice> = (set) => ({
  suppliers: mockSuppliers,
  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [{ ...supplier, id: generateId() }, ...state.suppliers] })),
  updateSupplier: (id, data) =>
    set((state) => ({ suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...data } : s)) })),
  deleteSupplier: (id) =>
    set((state) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) })),
});
