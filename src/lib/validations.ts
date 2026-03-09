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

export type TripFormData = z.infer<typeof tripSchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
