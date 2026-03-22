/**
 * types/index.ts
 * ❗ جميع الأنواع هنا مستنتجة من Zod Schemas في lib/validation.ts
 * هذا يضمن أن النوع والتحقق يكونان دائماً متزامنَيْن.
 */

import { z } from 'zod';
import {
  tripSchema,
  supplierSchema,
  expenseSchema,
  productSchema,
  shipmentSchema,
  customerSchema,
} from '@/lib/validation';

// ===== Core Domain Types (Zod-derived) =====
export type Trip        = z.infer<typeof tripSchema> & { id: string };
export type Supplier    = z.infer<typeof supplierSchema> & { id: string };
export type Expense     = z.infer<typeof expenseSchema> & { id: string };
export type Customer    = z.infer<typeof customerSchema> & { id: string };
export type Shipment    = z.infer<typeof shipmentSchema> & { id: string };

// Product has image_url which is optional url — derive then add id
export type Product = z.infer<typeof productSchema> & { id: string };

// ===== Quotation (no full Zod schema yet — inline type) =====
export type QuotationStatus = 'pending_sourcing' | 'priced' | 'sent_to_customer' | 'approved' | 'rejected';

export interface QuotationItem {
  id: string;
  product_name: string;
  product_name_en?: string;
  product_name_zh?: string;
  oem_number: string;
  brand: string;
  quantity: number;
  cost_rmb?: number;
  purchase_price: number;
  size: string;
  notes: string;
}

export interface Quotation {
  id: string;
  number: string;
  type?: 'incoming' | 'outgoing'; 
  customer_name?: string;
  status?: QuotationStatus;
  margin_percentage?: number;
  shipping_cbm_cost?: number;
  supplier_id: string;
  trip_id: string;
  date: string;
  currency?: string;
  amount_paid?: number;
  notes: string;
  items: QuotationItem[];
}

// ===== Invoice Types (not yet in Zod) =====
export interface PurchaseInvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  size: string;
  notes: string;
}

export interface PurchaseInvoice {
  id: string;
  number: string;
  supplier_id: string;
  supplier_name: string;
  trip_id: string;
  trip_name: string;
  shipment_id?: string;
  date: string;
  currency: string;
  amount_paid: number;
  notes: string;
  items: PurchaseInvoiceItem[];
}

export interface SalesInvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  sale_price: number;
  size: string;
  notes: string;
}

export interface SalesInvoice {
  id: string;
  number: string;
  customer_id: string;
  customer_name: string;
  date: string;
  currency: string;
  amount_paid: number;
  notes: string;
  items: SalesInvoiceItem[];
}

// ===== Inventory =====
export interface InventoryItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity_purchased: number;
  quantity_sold: number;
  quantity_available: number;
  purchase_price: number;
  sale_price: number;
  oem_alternatives?: string;
  vehicle_compatibility?: string;
  specifications?: string;
  unit?: string;
}

// ===== Settings =====
export interface CompanySettings {
  name: string;
  owner: string;
  phone: string;
  email: string;
  address: string;
  taxNumber: string;
  logo: string;
}

export interface CurrencyRates {
  CNY_USD: number;
  CNY_SAR: number;
  USD_CNY: number;
  USD_SAR: number;
  SAR_CNY: number;
  SAR_USD: number;
}

// Legacy (kept for compatibility)
export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
}
