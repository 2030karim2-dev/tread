/**
 * Suppliers Store Slice - شريحة إدارة الموردين
 */
import { Supplier } from '@/types';
import { mockSuppliers } from '@/data/mock-data';
import { generateId } from '@/lib/id';

export interface SuppliersState {
    suppliers: Supplier[];
    loading: boolean;
    error: string | null;
}

export const initialSuppliersState: SuppliersState = {
    suppliers: mockSuppliers,
    loading: false,
    error: null,
};

export interface SuppliersActions {
    addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
    updateSupplier: (id: string, data: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;
}

export const createSuppliersSlice = (set: any) => ({
    ...initialSuppliersState,
    addSupplier: (supplier: Omit<Supplier, 'id'>) =>
        set((state: SuppliersState) => ({ suppliers: [{ ...supplier, id: generateId() }, ...state.suppliers] })),
    updateSupplier: (id: string, data: Partial<Supplier>) =>
        set((state: SuppliersState) => ({
            suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...data } : s)),
        })),
    deleteSupplier: (id: string) =>
        set((state: SuppliersState) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) })),
});
