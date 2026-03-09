import { create } from 'zustand';
import { Trip, Supplier, Product, Shipment, Expense, InventoryItem } from '@/types';
import { mockTrips, mockSuppliers, mockProducts, mockShipments, mockExpenses, mockInventory } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

interface AppState {
  // Data
  trips: Trip[];
  suppliers: Supplier[];
  products: Product[];
  shipments: Shipment[];
  expenses: Expense[];
  inventory: InventoryItem[];

  // Trip actions
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;

  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;

  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductField: (id: string, field: string, value: string | number) => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
}

export const useAppStore = create<AppState>((set) => ({
  trips: mockTrips,
  suppliers: mockSuppliers,
  products: mockProducts,
  shipments: mockShipments,
  expenses: mockExpenses,
  inventory: mockInventory,

  addTrip: (trip) =>
    set((state) => ({ trips: [{ ...trip, id: generateId() }, ...state.trips] })),

  updateTrip: (id, data) =>
    set((state) => ({
      trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)),
    })),

  addSupplier: (supplier) =>
    set((state) => ({ suppliers: [{ ...supplier, id: generateId() }, ...state.suppliers] })),

  updateSupplier: (id, data) =>
    set((state) => ({
      suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...data } : s)),
    })),

  addProduct: (product) =>
    set((state) => ({ products: [...state.products, { ...product, id: generateId() }] })),

  updateProductField: (id, field, value) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      ),
    })),

  addExpense: (expense) =>
    set((state) => ({ expenses: [{ ...expense, id: generateId() }, ...state.expenses] })),
}));
