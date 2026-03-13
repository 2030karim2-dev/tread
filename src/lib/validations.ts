import { z } from 'zod';

export const tripSchema = z.object({
  name: z.string().trim().min(1, 'اسم الرحلة مطلوب').max(100, 'الاسم طويل جداً'),
  country: z.string().trim().min(1, 'البلد مطلوب'),
  city: z.string().trim().min(1, 'المدينة مطلوبة'),
  start_date: z.string().min(1, 'تاريخ البداية مطلوب'),
  end_date: z.string().min(1, 'تاريخ النهاية مطلوب'),
  notes: z.string().max(500).optional().default(''),
});

export const supplierSchema = z.object({
  name: z.string().trim().min(1, 'اسم المورد مطلوب').max(100),
  company_name: z.string().trim().min(1, 'اسم الشركة مطلوب').max(100),
  city: z.string().trim().min(1, 'المدينة مطلوبة'),
  phone: z.string().trim().min(1, 'رقم الهاتف مطلوب'),
  wechat_or_whatsapp: z.string().max(100).optional().default(''),
  product_category: z.string().trim().min(1, 'تصنيف المنتج مطلوب'),
  notes: z.string().max(500).optional().default(''),
});

export const expenseSchema = z.object({
  category: z.enum(['hotel', 'transport', 'food', 'samples', 'translator', 'other']),
  amount: z.number().positive('المبلغ يجب أن يكون أكبر من صفر'),
  currency: z.string().min(1),
  date: z.string().min(1, 'التاريخ مطلوب'),
  notes: z.string().max(500).optional().default(''),
});

export const customerSchema = z.object({
  name: z.string().trim().min(1, 'اسم العميل مطلوب').max(100),
  company_name: z.string().max(100).optional().default(''),
  city: z.string().trim().min(1, 'المدينة مطلوبة'),
  phone: z.string().trim().min(1, 'رقم الهاتف مطلوب'),
  notes: z.string().max(500).optional().default(''),
});

export const shipmentSchema = z.object({
  shipment_number: z.string().trim().min(1, 'رقم الشحنة مطلوب'),
  shipping_company: z.string().trim().min(1, 'شركة الشحن مطلوبة'),
  shipping_type: z.enum(['air', 'sea']),
  departure_port: z.string().trim().min(1, 'ميناء المغادرة مطلوب'),
  arrival_port: z.string().trim().min(1, 'ميناء الوصول مطلوب'),
  ship_date: z.string().min(1, 'تاريخ الشحن مطلوب'),
  expected_arrival_date: z.string().min(1, 'تاريخ الوصول المتوقع مطلوب'),
  shipping_cost: z.number().min(0, 'التكلفة يجب أن تكون صفر أو أكبر'),
  weight: z.number().min(0, 'الوزن يجب أن يكون صفر أو أكبر'),
  cartons_count: z.number().int().min(0, 'عدد الكراتين يجب أن يكون صفر أو أكبر'),
});

export type TripFormData = z.infer<typeof tripSchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type ShipmentFormData = z.infer<typeof shipmentSchema>;
