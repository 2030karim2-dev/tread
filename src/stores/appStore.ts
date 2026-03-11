// Zustand Store - China Trade Assistant Pro

import { create } from 'zustand';
import {
    Trip,
    Product,
    Supplier,
    Shipment,
    Expense,
    Note,
    Phrase
} from '../types/database';

interface AppState {
    // Data
    trips: Trip[];
    products: Product[];
    suppliers: Supplier[];
    shipments: Shipment[];
    expenses: Expense[];
    notes: Note[];
    phrases: Phrase[];

    // UI State
    isLoading: boolean;
    isOffline: boolean;
    isSyncing: boolean;

    // Actions - Trips
    setTrips: (trips: Trip[]) => void;
    addTrip: (trip: Trip) => void;
    updateTrip: (id: string, data: Partial<Trip>) => void;
    deleteTrip: (id: string) => void;

    // Actions - Products
    setProducts: (products: Product[]) => void;
    addProduct: (product: Product) => void;
    updateProduct: (id: string, data: Partial<Product>) => void;
    deleteProduct: (id: string) => void;

    // Actions - Suppliers
    setSuppliers: (suppliers: Supplier[]) => void;
    addSupplier: (supplier: Supplier) => void;
    updateSupplier: (id: string, data: Partial<Supplier>) => void;
    deleteSupplier: (id: string) => void;

    // Actions - Shipments
    setShipments: (shipments: Shipment[]) => void;
    addShipment: (shipment: Shipment) => void;
    updateShipment: (id: string, data: Partial<Shipment>) => void;
    deleteShipment: (id: string) => void;

    // Actions - Expenses
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
    updateExpense: (id: string, data: Partial<Expense>) => void;
    deleteExpense: (id: string) => void;

    // Actions - Notes
    setNotes: (notes: Note[]) => void;
    addNote: (note: Note) => void;
    updateNote: (id: string, data: Partial<Note>) => void;
    deleteNote: (id: string) => void;

    // Actions - Phrases
    setPhrases: (phrases: Phrase[]) => void;
    toggleFavoritePhrase: (id: string) => void;
    incrementPhraseUsage: (id: string) => void;

    // Actions - UI
    setLoading: (loading: boolean) => void;
    setOffline: (offline: boolean) => void;
    setSyncing: (syncing: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
    // Initial state
    trips: [],
    products: [],
    suppliers: [],
    shipments: [],
    expenses: [],
    notes: [],
    phrases: [],

    isLoading: true,
    isOffline: false,
    isSyncing: false,

    // Trips actions
    setTrips: (trips) => set({ trips }),
    addTrip: (trip) => set((state) => ({ trips: [trip, ...state.trips] })),
    updateTrip: (id, data) => set((state) => ({
        trips: state.trips.map((t) => t.id === id ? { ...t, ...data } : t)
    })),
    deleteTrip: (id) => set((state) => ({
        trips: state.trips.filter((t) => t.id !== id)
    })),

    // Products actions
    setProducts: (products) => set({ products }),
    addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
    updateProduct: (id, data) => set((state) => ({
        products: state.products.map((p) => p.id === id ? { ...p, ...data } : p)
    })),
    deleteProduct: (id) => set((state) => ({
        products: state.products.filter((p) => p.id !== id)
    })),

    // Suppliers actions
    setSuppliers: (suppliers) => set({ suppliers }),
    addSupplier: (supplier) => set((state) => ({ suppliers: [supplier, ...state.suppliers] })),
    updateSupplier: (id, data) => set((state) => ({
        suppliers: state.suppliers.map((s) => s.id === id ? { ...s, ...data } : s)
    })),
    deleteSupplier: (id) => set((state) => ({
        suppliers: state.suppliers.filter((s) => s.id !== id)
    })),

    // Shipments actions
    setShipments: (shipments) => set({ shipments }),
    addShipment: (shipment) => set((state) => ({ shipments: [shipment, ...state.shipments] })),
    updateShipment: (id, data) => set((state) => ({
        shipments: state.shipments.map((s) => s.id === id ? { ...s, ...data } : s)
    })),
    deleteShipment: (id) => set((state) => ({
        shipments: state.shipments.filter((s) => s.id !== id)
    })),

    // Expenses actions
    setExpenses: (expenses) => set({ expenses }),
    addExpense: (expense) => set((state) => ({ expenses: [expense, ...state.expenses] })),
    updateExpense: (id, data) => set((state) => ({
        expenses: state.expenses.map((e) => e.id === id ? { ...e, ...data } : e)
    })),
    deleteExpense: (id) => set((state) => ({
        expenses: state.expenses.filter((e) => e.id !== id)
    })),

    // Notes actions
    setNotes: (notes) => set({ notes }),
    addNote: (note) => set((state) => ({ notes: [note, ...state.notes] })),
    updateNote: (id, data) => set((state) => ({
        notes: state.notes.map((n) => n.id === id ? { ...n, ...data } : n)
    })),
    deleteNote: (id) => set((state) => ({
        notes: state.notes.filter((n) => n.id !== id)
    })),

    // Phrases actions
    setPhrases: (phrases) => set({ phrases }),
    toggleFavoritePhrase: (id) => set((state) => ({
        phrases: state.phrases.map((p) =>
            p.id === id ? { ...p, is_favorite: p.is_favorite ? 0 : 1 } : p
        )
    })),
    incrementPhraseUsage: (id) => set((state) => ({
        phrases: state.phrases.map((p) =>
            p.id === id ? { ...p, usage_count: p.usage_count + 1 } : p
        )
    })),

    // UI actions
    setLoading: (isLoading) => set({ isLoading }),
    setOffline: (isOffline) => set({ isOffline }),
    setSyncing: (isSyncing) => set({ isSyncing }),
}));
