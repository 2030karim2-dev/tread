export interface Trip {
  id: string;
  name: string;
  country: string;
  city: string;
  start_date: string;
  end_date: string;
  notes: string;
  status: 'planning' | 'active' | 'completed';
}

export interface Supplier {
  id: string;
  name: string;
  company_name: string;
  city: string;
  phone: string;
  wechat_or_whatsapp: string;
  product_category: string;
  rating: number;
  notes: string;
  trip_id: string;
}

export interface Product {
  id: string;
  name: string;
  oem_number: string;
  brand: string;
  size: string;
  purchase_price: number;
  sale_price: number;
  quantity: number;
  notes: string;
  rating: number;
  image_url?: string;
}

export interface Quotation {
  id: string;
  supplier_id: string;
  trip_id: string;
  date: string;
  notes: string;
  items: QuotationItem[];
}

export interface QuotationItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  purchase_price: number;
  size: string;
  notes: string;
}

export interface PurchaseInvoice {
  id: string;
  supplier_id: string;
  trip_id: string;
  date: string;
  currency: string;
  notes: string;
  items: PurchaseInvoiceItem[];
}

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

export interface Shipment {
  id: string;
  shipment_number: string;
  shipping_company: string;
  shipping_type: 'air' | 'sea';
  departure_port: string;
  arrival_port: string;
  ship_date: string;
  expected_arrival_date: string;
  shipping_cost: number;
  weight: number;
  cartons_count: number;
  status: 'purchased' | 'at_warehouse' | 'shipped' | 'in_transit' | 'arrived' | 'delivered';
}

export interface SalesInvoice {
  id: string;
  customer_name: string;
  date: string;
  currency: string;
  notes: string;
  items: SalesInvoiceItem[];
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

export interface Expense {
  id: string;
  trip_id: string;
  category: 'hotel' | 'transport' | 'food' | 'samples' | 'translator' | 'other';
  amount: number;
  currency: string;
  date: string;
  notes: string;
}

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
}

export interface CurrencyRate {
  from: string;
  to: string;
  rate: number;
}
