import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Trip, Supplier, Product, Shipment, Expense, InventoryItem, Customer, Quotation, CompanySettings, CurrencyRates } from '@/types';
import { mockTrips, mockSuppliers, mockProducts, mockShipments, mockExpenses, mockInventory } from '@/data/mock-data';
import { generateId } from '@/lib/helpers';

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

// ===== Default mock data for invoices =====
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
      { id: '3', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 200, purchase_price: 18, size: 'أمامي', notes: '' },
    ],
  },
  {
    id: '2', supplier_id: '3', trip_id: '1', date: '2025-01-14', notes: '',
    items: [
      { id: '4', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 500, purchase_price: 9.5, size: 'قياسي', notes: '' },
      { id: '5', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 300, purchase_price: 11, size: 'كبير', notes: '' },
      { id: '6', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 200, purchase_price: 19, size: 'أمامي', notes: '' },
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
  CNY_USD: 0.14,
  CNY_SAR: 0.52,
  USD_CNY: 7.15,
  USD_SAR: 3.75,
  SAR_CNY: 1.91,
  SAR_USD: 0.27,
};

// ===== App State Interface =====
interface AppState {
  // Data
  trips: Trip[];
  suppliers: Supplier[];
  products: Product[];
  shipments: Shipment[];
  expenses: Expense[];
  inventory: InventoryItem[];
  customers: Customer[];
  quotations: Quotation[];
  purchaseInvoices: StorePurchaseInvoice[];
  salesInvoices: StoreSalesInvoice[];
  companySettings: CompanySettings;
  currencyRates: CurrencyRates;

  // Trip actions
  addTrip: (trip: Omit<Trip, 'id'>) => void;
  updateTrip: (id: string, data: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;

  // Supplier actions
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void;
  updateSupplier: (id: string, data: Partial<Supplier>) => void;
  deleteSupplier: (id: string) => void;

  // Product actions
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProductField: (id: string, field: string, value: string | number) => void;
  deleteProduct: (id: string) => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, data: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;

  // Shipment actions
  addShipment: (shipment: Omit<Shipment, 'id'>) => void;
  updateShipment: (id: string, data: Partial<Shipment>) => void;
  deleteShipment: (id: string) => void;

  // Customer actions
  addCustomer: (customer: Omit<Customer, 'id'>) => void;
  updateCustomer: (id: string, data: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Quotation actions
  addQuotation: (quotation: Omit<Quotation, 'id'>) => void;
  updateQuotation: (id: string, data: Partial<Quotation>) => void;
  deleteQuotation: (id: string) => void;

  // Purchase Invoice actions
  addPurchaseInvoice: (invoice: Omit<StorePurchaseInvoice, 'id'>) => void;
  updatePurchaseInvoice: (id: string, data: Partial<StorePurchaseInvoice>) => void;
  deletePurchaseInvoice: (id: string) => void;

  // Sales Invoice actions
  addSalesInvoice: (invoice: Omit<StoreSalesInvoice, 'id'>) => void;
  updateSalesInvoice: (id: string, data: Partial<StoreSalesInvoice>) => void;
  deleteSalesInvoice: (id: string) => void;

  // Inventory actions
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryField: (id: string, field: string, value: string | number) => void;
  deleteInventoryItem: (id: string) => void;

  // Settings actions
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  updateCurrencyRates: (rates: Partial<CurrencyRates>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ===== Initial Data =====
      trips: mockTrips,
      suppliers: mockSuppliers,
      products: mockProducts,
      shipments: mockShipments,
      expenses: mockExpenses,
      inventory: mockInventory,
      customers: defaultCustomers,
      quotations: defaultQuotations,
      purchaseInvoices: defaultPurchaseInvoices,
      salesInvoices: defaultSalesInvoices,
      companySettings: defaultCompanySettings,
      currencyRates: defaultCurrencyRates,

      // ===== Trip Actions =====
      addTrip: (trip) =>
        set((state) => ({ trips: [{ ...trip, id: generateId() }, ...state.trips] })),
      updateTrip: (id, data) =>
        set((state) => ({ trips: state.trips.map((t) => (t.id === id ? { ...t, ...data } : t)) })),
      deleteTrip: (id) =>
        set((state) => ({ trips: state.trips.filter((t) => t.id !== id) })),

      // ===== Supplier Actions =====
      addSupplier: (supplier) =>
        set((state) => ({ suppliers: [{ ...supplier, id: generateId() }, ...state.suppliers] })),
      updateSupplier: (id, data) =>
        set((state) => ({ suppliers: state.suppliers.map((s) => (s.id === id ? { ...s, ...data } : s)) })),
      deleteSupplier: (id) =>
        set((state) => ({ suppliers: state.suppliers.filter((s) => s.id !== id) })),

      // ===== Product Actions =====
      addProduct: (product) =>
        set((state) => ({ products: [...state.products, { ...product, id: generateId() }] })),
      updateProductField: (id, field, value) =>
        set((state) => ({ products: state.products.map((p) => (p.id === id ? { ...p, [field]: value } : p)) })),
      deleteProduct: (id) =>
        set((state) => ({ products: state.products.filter((p) => p.id !== id) })),

      // ===== Expense Actions =====
      addExpense: (expense) =>
        set((state) => ({ expenses: [{ ...expense, id: generateId() }, ...state.expenses] })),
      updateExpense: (id, data) =>
        set((state) => ({ expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...data } : e)) })),
      deleteExpense: (id) =>
        set((state) => ({ expenses: state.expenses.filter((e) => e.id !== id) })),

      // ===== Shipment Actions =====
      addShipment: (shipment) =>
        set((state) => ({ shipments: [{ ...shipment, id: generateId() }, ...state.shipments] })),
      updateShipment: (id, data) =>
        set((state) => ({ shipments: state.shipments.map((s) => (s.id === id ? { ...s, ...data } : s)) })),
      deleteShipment: (id) =>
        set((state) => ({ shipments: state.shipments.filter((s) => s.id !== id) })),

      // ===== Customer Actions =====
      addCustomer: (customer) =>
        set((state) => ({ customers: [{ ...customer, id: generateId() }, ...state.customers] })),
      updateCustomer: (id, data) =>
        set((state) => ({ customers: state.customers.map((c) => (c.id === id ? { ...c, ...data } : c)) })),
      deleteCustomer: (id) =>
        set((state) => ({ customers: state.customers.filter((c) => c.id !== id) })),

      // ===== Quotation Actions =====
      addQuotation: (quotation) =>
        set((state) => ({ quotations: [{ ...quotation, id: generateId() }, ...state.quotations] })),
      updateQuotation: (id, data) =>
        set((state) => ({ quotations: state.quotations.map((q) => (q.id === id ? { ...q, ...data } : q)) })),
      deleteQuotation: (id) =>
        set((state) => ({ quotations: state.quotations.filter((q) => q.id !== id) })),

      // ===== Purchase Invoice Actions =====
      addPurchaseInvoice: (invoice) =>
        set((state) => ({ purchaseInvoices: [...state.purchaseInvoices, { ...invoice, id: generateId() }] })),
      updatePurchaseInvoice: (id, data) =>
        set((state) => ({ purchaseInvoices: state.purchaseInvoices.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)) })),
      deletePurchaseInvoice: (id) =>
        set((state) => ({ purchaseInvoices: state.purchaseInvoices.filter((inv) => inv.id !== id) })),

      // ===== Sales Invoice Actions =====
      addSalesInvoice: (invoice) =>
        set((state) => ({ salesInvoices: [...state.salesInvoices, { ...invoice, id: generateId() }] })),
      updateSalesInvoice: (id, data) =>
        set((state) => ({ salesInvoices: state.salesInvoices.map((inv) => (inv.id === id ? { ...inv, ...data } : inv)) })),
      deleteSalesInvoice: (id) =>
        set((state) => ({ salesInvoices: state.salesInvoices.filter((inv) => inv.id !== id) })),

      // ===== Inventory Actions =====
      addInventoryItem: (item) =>
        set((state) => ({ inventory: [...state.inventory, { ...item, id: generateId() }] })),
      updateInventoryField: (id, field, value) =>
        set((state) => ({ inventory: state.inventory.map((i) => (i.id === id ? { ...i, [field]: value } : i)) })),
      deleteInventoryItem: (id) =>
        set((state) => ({ inventory: state.inventory.filter((i) => i.id !== id) })),

      // ===== Settings Actions =====
      updateCompanySettings: (settings) =>
        set((state) => ({ companySettings: { ...state.companySettings, ...settings } })),
      updateCurrencyRates: (rates) =>
        set((state) => ({ currencyRates: { ...state.currencyRates, ...rates } })),
    }),
    {
      name: 'trade-navigator-store',
      version: 1,
    }
  )
);
