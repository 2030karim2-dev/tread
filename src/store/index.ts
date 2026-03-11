/**
 * Store Index - فهرس الـ Store
 * تقسيم الـ store إلى شرائح (slices) لتحسين الصيانة والتوسع
 */

import { create } from 'zustand';
import { Trip, Supplier, Product, Shipment, Expense, InventoryItem } from '@/types';
import { mockShipments, mockInventory } from '@/data/mock-data';
import { generateId } from '@/lib/id';

// استيراد الشرائح
import { createTripsSlice, TripsState, TripsActions } from './slices/tripsSlice';
import { createSuppliersSlice, SuppliersState, SuppliersActions } from './slices/suppliersSlice';
import { createProductsSlice, ProductsState, ProductsActions } from './slices/productsSlice';
import { createExpensesSlice, ExpensesState, ExpensesActions } from './slices/expensesSlice';

// أنواع البيانات المدمجة
interface ShipmentsData {
    shipments: Shipment[];
}

interface InventoryData {
    inventory: InventoryItem[];
}

// الحالة الكاملة للتطبيق
export interface AppState extends
    TripsState, TripsActions,
    SuppliersState, SuppliersActions,
    ProductsState, ProductsActions,
    ExpensesState, ExpensesActions,
    ShipmentsData,
    InventoryData {
    // إجراءات الشحنات (يمكن نقلها إلى شريحة منفصلة لاحقاً)
    addShipment: (shipment: Omit<Shipment, 'id'>) => void;
    updateShipment: (id: string, data: Partial<Shipment>) => void;
    deleteShipment: (id: string) => void;
}

/**
 * الـ Store الرئيسي للتطبيق
 */
export const useAppStore = create<AppState>((set) => ({
    // تهيئة شريحة الرحلات
    ...createTripsSlice(set),

    // تهيئة شريحة الموردين
    ...createSuppliersSlice(set),

    // تهيئة شريحة المنتجات
    ...createProductsSlice(set),

    // تهيئة شريحة المصروفات
    ...createExpensesSlice(set),

    // بيانات الشحنات
    shipments: mockShipments,
    addShipment: (shipment) =>
        set((state: AppState) => ({
            shipments: [{ ...shipment, id: generateId() }, ...state.shipments],
        })),
    updateShipment: (id, data) =>
        set((state: AppState) => ({
            shipments: state.shipments.map((s) =>
                s.id === id ? { ...s, ...data } : s
            ),
        })),
    deleteShipment: (id) =>
        set((state: AppState) => ({
            shipments: state.shipments.filter((s) => s.id !== id),
        })),

    // بيانات المخزون
    inventory: mockInventory,
}));

// مساعدات الاختيار (Selectors) - للوصول السريع للبيانات
export const selectTrips = (state: AppState) => state.trips;
export const selectSuppliers = (state: AppState) => state.suppliers;
export const selectProducts = (state: AppState) => state.products;
export const selectShipments = (state: AppState) => state.shipments;
export const selectExpenses = (state: AppState) => state.expenses;
export const selectInventory = (state: AppState) => state.inventory;
