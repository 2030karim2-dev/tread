/**
 * Validation Utilities - أدوات التحقق
 * تحسينات على التحقق من صحة البيانات
 */

import { z } from 'zod';

/**
 * التحقق من صحة النص
 */
export const stringSchema = {
    required: (fieldName: string, minLength = 1, maxLength = 100) =>
        z.string()
            .trim()
            .min(minLength, `${fieldName} مطلوب`)
            .max(maxLength, `${fieldName} طويل جداً`),

    optional: (maxLength = 500) =>
        z.string().trim().max(maxLength).optional().default(''),

    email: () =>
        z.string().email('البريد الإلكتروني غير صحيح'),

    phone: () =>
        z.string().regex(/^[\d\s\-+()]+$/, 'رقم الهاتف غير صحيح'),
};

/**
 * التحقق من الأرقام
 */
export const numberSchema = {
    positive: (fieldName: string) =>
        z.number().positive(`${fieldName} يجب أن يكون أكبر من صفر`),

    nonNegative: (fieldName: string) =>
        z.number().min(0, `${fieldName} يجب أن يكون أكبر من أو يساوي صفر`),

    integer: (fieldName: string) =>
        z.number().int(`${fieldName} يجب أن يكون رقماً صحيحاً`),

    range: (fieldName: string, min: number, max: number) =>
        z.number().min(min, `${fieldName} يجب أن يكون على الأقل ${min}`)
            .max(max, `${fieldName} يجب أن يكون على الأكثر ${max}`),
};

/**
 * schemas محددة مسبقاً
 */

// Trip schema محسّن
export const tripSchema = z.object({
    name: z.string()
        .trim()
        .min(1, 'اسم الرحلة مطلوب')
        .max(100, 'الاسم طويل جداً'),
    country: z.string()
        .trim()
        .min(1, 'البلد مطلوب'),
    city: z.string()
        .trim()
        .min(1, 'المدينة مطلوبة'),
    start_date: z.string()
        .min(1, 'تاريخ البداية مطلوب'),
    end_date: z.string()
        .min(1, 'تاريخ النهاية مطلوب'),
    notes: z.string()
        .max(500)
        .optional()
        .default(''),
    status: z.enum(['planning', 'active', 'completed']).optional(),
});

// Supplier schema محسّن
export const supplierSchema = z.object({
    name: z.string().trim().min(1, 'اسم المورد مطلوب').max(100),
    company_name: z.string().trim().min(1, 'اسم الشركة مطلوب').max(100),
    city: z.string().trim().min(1, 'المدينة مطلوبة'),
    phone: z.string().trim().min(1, 'رقم الهاتف مطلوب'),
    whatsapp: z.string().max(100).optional().default(''),
    wechat: z.string().max(100).optional().default(''),
    website: z.string().url('رابط الموقع غير صحيح').or(z.literal('')).optional().default(''),
    facebook: z.string().url('رابط فيس بوك غير صحيح').or(z.literal('')).optional().default(''),
    google_maps: z.string().url('رابط خرائط جوجل غير صحيح').or(z.literal('')).optional().default(''),
    china_maps: z.string().url('رابط خرائط الصين غير صحيح').or(z.literal('')).optional().default(''),
    product_category: z.string().trim().min(1, 'تصنيف المنتج مطلوب'),
    notes: z.string().max(500).optional().default(''),
    rating: z.number().min(0).max(5).optional(),
    factory_grade: z.enum(['A', 'B', 'C']).optional().default('A'),
    moq: z.string().max(100).optional().default(''),
    lead_time_days: z.number().min(0).optional().default(15),
    trip_id: z.string().min(1, 'الرحلة مطلوبة'),
});

// Expense schema محسّن
export const expenseSchema = z.object({
    category: z.enum([
        'hotel',
        'transport',
        'food',
        'samples',
        'translator',
        'other'
    ]),
    amount: z.number()
        .positive('المبلغ يجب أن يكون أكبر من صفر'),
    currency: z.enum(['CNY', 'USD', 'SAR']),
    date: z.string()
        .min(1, 'التاريخ مطلوب'),
    notes: z.string()
        .max(500)
        .optional()
        .default(''),
    trip_id: z.string().optional(),
});

// Product schema
export const productSchema = z.object({
    name: z.string()
        .trim()
        .min(1, 'اسم المنتج (عربي) مطلوب')
        .max(100),
    name_en: z.string()
        .trim()
        .max(100)
        .optional()
        .default(''),
    name_zh: z.string()
        .trim()
        .max(100)
        .optional()
        .default(''),
    oem_number: z.string()
        .trim()
        .max(50)
        .optional()
        .default(''),
    brand: z.string()
        .trim()
        .max(50)
        .optional()
        .default(''),
    size: z.string()
        .trim()
        .max(30)
        .optional()
        .default(''),
    cost_rmb: z.number()
        .nonnegative('التكلفة باليوان يجب أن تكون موجبة')
        .optional()
        .default(0),
    purchase_price: z.number()
        .nonnegative('سعر الشراء (واصل) يجب أن يكون أكبر من أو يساوي صفر'),
    sale_price: z.number()
        .nonnegative('سعر البيع يجب أن يكون أكبر من أو يساوي صفر'),
    quantity: z.number()
        .int()
        .nonnegative('الكمية يجب أن تكون أكبر من أو تساوي صفر'),
    notes: z.string()
        .max(500)
        .optional()
        .default(''),
    rating: z.number().min(0).max(5).optional(),
    image_url: z.string().url().optional(),
    oem_alternatives: z.string().max(200).optional().default(''),
    vehicle_compatibility: z.string().max(300).optional().default(''),
    specifications: z.string().max(1000).optional().default(''),
    unit: z.string().optional().default('قطعة'),
});

// Shipment schema
export const shipmentSchema = z.object({
    shipment_number: z.string()
        .trim()
        .min(1, 'رقم الشحنة مطلوب'),
    shipping_company: z.string()
        .trim()
        .min(1, 'شركة الشحن مطلوبة'),
    shipping_type: z.enum(['air', 'sea']),
    departure_port: z.string()
        .trim()
        .min(1, 'ميناء المغادرة مطلوب'),
    arrival_port: z.string()
        .trim()
        .min(1, 'ميناء الوصول مطلوب'),
    ship_date: z.string()
        .min(1, 'تاريخ الشحن مطلوب'),
    expected_arrival_date: z.string()
        .min(1, 'تاريخ الوصول المتوقع مطلوب'),
    shipping_cost: z.number()
        .nonnegative('تكلفة الشحن يجب أن تكون أكبر من أو تساوي صفر'),
    weight: z.number()
        .nonnegative('الوزن يجب أن يكون أكبر من أو يساوي صفر'),
    cartons_count: z.number()
        .int()
        .nonnegative('عدد الكراتين يجب أن يكون أكبر من أو يساوي صفر'),
    cbm: z.number()
        .nonnegative('الحجم (CBM) يجب أن يكون أكبر من أو يساوي صفر'),
    container_type: z.enum(['20ft', '40ft', '40HQ', 'LCL']),
    status: z.enum([
        'purchased',
        'production',
        'at_warehouse',
        'shipped',
        'in_transit',
        'arrived',
        'delivered'
    ]).optional(),
});

// Customer schema
export const customerSchema = z.object({
    name: z.string().trim().min(1, 'اسم العميل مطلوب').max(100),
    company_name: z.string().max(100).optional().default(''),
    city: z.string().trim().min(1, 'المدينة مطلوبة'),
    phone: z.string().trim().min(1, 'رقم الهاتف مطلوب'),
    whatsapp: z.string().max(100).optional().default(''),
    wechat: z.string().max(100).optional().default(''),
    website: z.string().url('رابط الموقع غير صحيح').or(z.literal('')).optional().default(''),
    facebook: z.string().url('رابط فيس بوك غير صحيح').or(z.literal('')).optional().default(''),
    google_maps: z.string().url('رابط خرائط جوجل غير صحيح').or(z.literal('')).optional().default(''),
    china_maps: z.string().url('رابط خرائط الصين غير صحيح').or(z.literal('')).optional().default(''),
    notes: z.string().max(500).optional().default(''),
});

export type TripFormData = z.infer<typeof tripSchema>;
export type SupplierFormData = z.infer<typeof supplierSchema>;
export type ExpenseFormData = z.infer<typeof expenseSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type ShipmentFormData = z.infer<typeof shipmentSchema>;

/**
 * Helper functions للـ validation
 */

/**
 * التحقق من صحة البيانات
 * @example
 * const result = validate(tripSchema, formData);
 * if (!result.isValid) {
 *   console.log(result.errors);
 * }
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown) {
    const result = schema.safeParse(data);

    if (result.success) {
        return {
            isValid: true,
            data: result.data,
            errors: [],
        };
    }

    const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
        code: issue.code,
    }));

    return {
        isValid: false,
        data: undefined,
        errors,
    };
}

/**
 * التحقق مع معالجة الأخطاء المخصصة
 */
export function validateOrThrow<T>(schema: z.ZodSchema<T>, data: unknown): T {
    return schema.parse(data);
}

/**
 * استخراج رسائل الخطأ كـ object
 */
export function getFieldErrors<T extends Record<string, unknown>>(
    errors: { field: string; message: string }[]
): Partial<Record<keyof T, string>> {
    return errors.reduce((acc, error) => {
        const field = error.field as keyof T;
        acc[field] = error.message;
        return acc;
    }, {} as Partial<Record<keyof T, string>>);
}
