import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { zustandStorage } from '@/services/storageService';
import { Customer, Shipment, InventoryItem, Quotation, CompanySettings, CurrencyRates } from '@/types';
import { mockShipments, mockInventory } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

// Import Slices
import { createTripsSlice, type TripsSlice } from './slices/tripsSlice';
import { createSuppliersSlice, type SuppliersSlice } from './slices/suppliersSlice';
import { createProductsSlice, type ProductsSlice } from './slices/productsSlice';
import { createExpensesSlice, type ExpensesSlice } from './slices/expensesSlice';

// ===== Purchase Invoice (local to store) =====
export interface StorePurchaseInvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  size: string;
}

export interface StorePurchaseInvoice {
  id: string;
  number: string;
  supplier_id: string;
  supplier_name: string;
  trip_id: string;
  trip_name: string;
  date: string;
  items: StorePurchaseInvoiceItem[];
}

// ===== Sales Invoice (local to store) =====
export interface StoreSalesInvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  sale_price: number;
  size: string;
}

export interface StoreSalesInvoice {
  id: string;
  number: string;
  customer_id: string;
  customer_name: string;
  date: string;
  items: StoreSalesInvoiceItem[];
}

// ===== Default data =====
const defaultPurchaseInvoices: StorePurchaseInvoice[] = [
  {
    id: '1', number: 'INV-2025-001', supplier_id: '1', supplier_name: 'Guangzhou Auto Parts Co.',
    trip_id: '1', trip_name: 'قوانغتشو يناير 2025', date: '2025-01-20',
    items: [
      { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 500, purchase_price: 8, sale_price: 15, size: 'قياسي' },
      { id: '2', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 300, purchase_price: 12, sale_price: 25, size: 'كبير' },
      { id: '3', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 200, purchase_price: 18, sale_price: 35, size: 'أمامي' },
    ],
  },
  {
    id: '2', number: 'INV-2025-002', supplier_id: '3', supplier_name: 'Shanghai Brake Systems',
    trip_id: '1', trip_name: 'قوانغتشو يناير 2025', date: '2025-01-22',
    items: [
      { id: '4', product_name: 'شمعات إشعال', oem_number: '90919-01253', brand: 'Denso', quantity: 1000, purchase_price: 5, sale_price: 12, size: 'قياسي' },
      { id: '5', product_name: 'سير مكيف', oem_number: '99332-10960', brand: 'Gates', quantity: 150, purchase_price: 10, sale_price: 22, size: '6PK1060' },
    ],
  },
];

const defaultSalesInvoices: StoreSalesInvoice[] = [
  {
    id: '1', number: 'SALE-2025-001', customer_id: '1', customer_name: 'أحمد محمد', date: '2025-03-01',
    items: [
      { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 100, sale_price: 15, size: 'قياسي' },
      { id: '2', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 30, sale_price: 35, size: 'أمامي' },
    ],
  },
  {
    id: '2', number: 'SALE-2025-002', customer_id: '2', customer_name: 'محمد علي', date: '2025-03-05',
    items: [
      { id: '3', product_name: 'شمعات إشعال', oem_number: '90919-01253', brand: 'Denso', quantity: 200, sale_price: 12, size: 'قياسي' },
      { id: '4', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 50, sale_price: 25, size: 'كبير' },
    ],
  },
];

const defaultQuotations: Quotation[] = [
  {
    id: '1', supplier_id: '1', trip_id: '1', date: '2025-01-12', notes: '',
    items: [
      { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 500, purchase_price: 8, size: 'قياسي', notes: '' },
      { id: '2', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 300, purchase_price: 12, size: 'كبير', notes: '' },
    ],
  },
];

const defaultCustomers: Customer[] = [
  { id: '1', name: 'أحمد محمد', company_name: 'مؤسسة الأحمد لقطع الغيار', city: 'الرياض', phone: '+966 50 111 1111', notes: '' },
  { id: '2', name: 'محمد علي', company_name: 'ورشة النجم', city: 'جدة', phone: '+966 55 222 2222', notes: '' },
];

const defaultCompanySettings: CompanySettings = {
  name: 'AutoParts',
  owner: 'مدير النظام',
  phone: '+966 50 000 0000',
  email: 'info@autoparts.sa',
  address: 'الرياض، المملكة العربية السعودية',
  taxNumber: '300000000000003',
  logo: '',
};

const defaultCurrencyRates: CurrencyRates = {
  CNY_USD: 0.14, CNY_SAR: 0.52,
  USD_CNY: 7.15, USD_SAR: 3.75,
  SAR_CNY: 1.91, SAR_USD: 0.27,
};

// ===== Remaining slices (non-extracted yet) =====
interface CoreState {
  shipments: Shipment[];
  inventory: InventoryItem[];
  customers: Customer[];
  quotations: Quotation[];
  purchaseInvoices: StorePurchaseInvoice[];
  salesInvoices: StoreSalesInvoice[];
  companySettings: CompanySettings;
  currencyRates: CurrencyRates;

  addShipment: (shipment: Omit<Shipment, 'id'>) => void;
  updateShipment: (id: string, data: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;

  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  addQuotation: (quotation: Omit<Quotation, 'id'>) => void;
  updateQuotation: (id: string, data: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;

  addPurchaseInvoice: (invoice: Omit<StorePurchaseInvoice, 'id'>) => void;
  updatePurchaseInvoice: (id: string, data: Partial<StorePurchaseInvoice>) => void;
  deletePurchaseInvoice: (id: string) => void;

  addSalesInvoice: (invoice: Omit<StoreSalesInvoice, 'id'>) => void;
  updateSalesInvoice: (id: string, data: Partial<StoreSalesInvoice>) => void;
  deleteSalesInvoice: (id: string) => void;

  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryField: (id: string, field: string, value: string | number) => void;
  deleteInventoryItem: (id: string) => void;

  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  updateCurrencyRates: (rates: Partial<CurrencyRates>) => void;
}

// ===== Combined AppState =====
export type AppState = TripsSlice & SuppliersSlice & ProductsSlice & ExpensesSlice & CoreState;

export const useAppStore = create<AppState>()(
  persist(
    (...a) => ({
      // Composed Slices
      ...createTripsSlice(...a),
      ...createSuppliersSlice(...a),
      ...createProductsSlice(...a),
      ...createExpensesSlice(...a),

      // ===== Core State (not yet in slices) =====
      shipments: mockShipments,
      inventory: mockInventory,
      customers: defaultCustomers,
      quotations: defaultQuotations,
      purchaseInvoices: defaultPurchaseInvoices,
      salesInvoices: defaultSalesInvoices,
      companySettings: defaultCompanySettings,
      currencyRates: defaultCurrencyRates,

      addShipment: (shipment) =>
        a[0]((state) => ({ shipments: [{ ...shipment, id: generateId() }, ...state.shipments] })),
      updateShipment: (id, data) =>
        a[0]((state) => ({ shipments: state.shipments.map((s) => (s.id === id ? { ...s, ...data } : s)) })),
      deleteShipment: (id) =>
        a[0]((state) => ({ shipments: state.shipments.filter((s) => s.id !== id) })),

      addCustomer: (customer) =>
        a[0]((state) => ({ customers: [{ ...customer, id: generateId() }, ...state.customers] })),
      updateCustomer: (id, data) =>
        a[0]((state) => ({ customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      deleteCustomer: (id) =>
        a[0]((state) => ({ customers: state.customers.filter((c) => c.id !== id) })),

      addQuotation: (quotation) =>
        a[0]((state) => ({ quotations: [{ ...quotation, id: generateId() }, ...state.quotations] })),
      updateQuotation: (id, data) =>
        a[0]((state) => ({ quotations: state.quotations.map((q) => (q.id === id ? { ...q, ...data } : q)) })),
      deleteQuotation: (id) =>
        a[0]((state) => ({ quotations: state.quotations.filter((q) => q.id !== id) })),

      addPurchaseInvoice: (invoice) =>
        a[0]((state) => ({ purchaseInvoices: [...state.purchaseInvoices, { ...invoice, id: generateId() }] })),
      updatePurchaseInvoice: (id, data) =>
        a[0]((state) => ({ purchaseInvoices: state.purchaseInvoices.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)) })),
      deletePurchaseInvoice: (id) =>
        a[0]((state) => ({ purchaseInvoices: state.purchaseInvoices.filter((inv) => inv.id !== id) })),

      addSalesInvoice: (invoice) =>
        a[0]((state) => ({ salesInvoices: [...state.salesInvoices, { ...invoice, id: generateId() }] })),
      updateSalesInvoice: (id, data) =>
        a[0]((state) => ({ salesInvoices: state.salesInvoices.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)) })),
      deleteSalesInvoice: (id) =>
        a[0]((state) => ({ salesInvoices: state.salesInvoices.filter((inv) => inv.id !== id) })),

      addInventoryItem: (item) =>
        a[0]((state) => ({ inventory: [...state.inventory, { ...item, id: generateId() }] })),
      updateInventoryField: (id, field, value) =>
        a[0]((state) => ({ inventory: state.inventory.map((i) => (i.id === id ? { ...i, [field]: value } : i)) })),
      deleteInventoryItem: (id) =>
        a[0]((state) => ({ inventory: state.inventory.filter((i) => i.id !== id) })),

      updateCompanySettings: (settings) =>
        a[0]((state) => ({ companySettings: { ...state.companySettings, ...settings } })),
      updateCurrencyRates: (rates) =>
        a[0]((state) => ({ currencyRates: { ...state.currencyRates, ...rates } })),
    }),
    {
      name: 'trade-navigator-store',
      version: 1,
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
