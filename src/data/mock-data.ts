import { Trip, Supplier, Product, Shipment, Expense, InventoryItem } from '@/types';

export const mockTrips: Trip[] = [
  { id: '1', name: 'رحلة قوانغتشو - يناير 2025', country: 'الصين', city: 'قوانغتشو', start_date: '2025-01-10', end_date: '2025-01-25', notes: 'رحلة شراء قطع غيار تويوتا', status: 'completed' },
  { id: '2', name: 'رحلة ييوو - مارس 2025', country: 'الصين', city: 'ييوو', start_date: '2025-03-05', end_date: '2025-03-20', notes: 'رحلة شراء إكسسوارات سيارات', status: 'active' },
  { id: '3', name: 'رحلة شنغهاي - مايو 2025', country: 'الصين', city: 'شنغهاي', start_date: '2025-05-01', end_date: '2025-05-15', notes: '', status: 'planning' },
];

export const mockSuppliers: Supplier[] = [
  { id: '1', name: 'وانغ لي', company_name: 'Guangzhou Auto Parts Co.', city: 'قوانغتشو', phone: '+86-136-1234-5678', wechat_or_whatsapp: 'wang_autoparts', product_category: 'فلاتر وزيوت', rating: 5, notes: 'مورد ممتاز وموثوق', trip_id: '1' },
  { id: '2', name: 'تشن وي', company_name: 'Yiwu Motor Accessories', city: 'ييوو', phone: '+86-158-8765-4321', wechat_or_whatsapp: 'chen_motors', product_category: 'إكسسوارات داخلية', rating: 4, notes: '', trip_id: '2' },
  { id: '3', name: 'ليو هوا', company_name: 'Shanghai Brake Systems', city: 'شنغهاي', phone: '+86-139-2468-1357', wechat_or_whatsapp: 'liu_brakes', product_category: 'فرامل', rating: 4, notes: 'أسعار تنافسية', trip_id: '1' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', size: 'قياسي', purchase_price: 8, sale_price: 15, quantity: 500, notes: '', rating: 5 },
  { id: '2', name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', size: 'كبير', purchase_price: 12, sale_price: 25, quantity: 300, notes: '', rating: 4 },
  { id: '3', name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', size: 'أمامي', purchase_price: 18, sale_price: 35, quantity: 200, notes: '', rating: 5 },
  { id: '4', name: 'شمعات إشعال', oem_number: '90919-01253', brand: 'Denso', size: 'قياسي', purchase_price: 5, sale_price: 12, quantity: 1000, notes: '', rating: 4 },
  { id: '5', name: 'سير مكيف', oem_number: '99332-10960', brand: 'Gates', size: '6PK1060', purchase_price: 10, sale_price: 22, quantity: 150, notes: '', rating: 3 },
];

export const mockShipments: Shipment[] = [
  { id: '1', shipment_number: 'SHP-2025-001', shipping_company: 'ميرسك', shipping_type: 'sea', departure_port: 'قوانغتشو', arrival_port: 'عدن', ship_date: '2025-01-28', expected_arrival_date: '2025-03-10', shipping_cost: 4500, weight: 2500, cartons_count: 45, status: 'delivered' },
  { id: '2', shipment_number: 'SHP-2025-002', shipping_company: 'CMA CGM', shipping_type: 'sea', departure_port: 'ييوو', arrival_port: 'عدن', ship_date: '2025-03-22', expected_arrival_date: '2025-05-05', shipping_cost: 3800, weight: 1800, cartons_count: 30, status: 'in_transit' },
];

export const mockExpenses: Expense[] = [
  { id: '1', trip_id: '1', category: 'hotel', amount: 3500, currency: 'CNY', date: '2025-01-10', notes: 'فندق قوانغتشو 15 ليلة' },
  { id: '2', trip_id: '1', category: 'transport', amount: 800, currency: 'CNY', date: '2025-01-12', notes: 'تنقلات داخلية' },
  { id: '3', trip_id: '1', category: 'food', amount: 1200, currency: 'CNY', date: '2025-01-25', notes: 'وجبات طعام' },
  { id: '4', trip_id: '2', category: 'hotel', amount: 2800, currency: 'CNY', date: '2025-03-05', notes: 'فندق ييوو' },
  { id: '5', trip_id: '1', category: 'translator', amount: 2000, currency: 'CNY', date: '2025-01-15', notes: 'مترجم صيني عربي' },
];

export const mockInventory: InventoryItem[] = [
  { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity_purchased: 500, quantity_sold: 180, quantity_available: 320, purchase_price: 8, sale_price: 15 },
  { id: '2', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity_purchased: 300, quantity_sold: 95, quantity_available: 205, purchase_price: 12, sale_price: 25 },
  { id: '3', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity_purchased: 200, quantity_sold: 60, quantity_available: 140, purchase_price: 18, sale_price: 35 },
  { id: '4', product_name: 'شمعات إشعال', oem_number: '90919-01253', brand: 'Denso', quantity_purchased: 1000, quantity_sold: 420, quantity_available: 580, purchase_price: 5, sale_price: 12 },
  { id: '5', product_name: 'سير مكيف', oem_number: '99332-10960', brand: 'Gates', quantity_purchased: 150, quantity_sold: 30, quantity_available: 120, purchase_price: 10, sale_price: 22 },
];

export const currencyRates = {
  CNY_USD: 0.14,
  CNY_SAR: 0.52,
  USD_CNY: 7.15,
  USD_SAR: 3.75,
  SAR_CNY: 1.91,
  SAR_USD: 0.27,
};
