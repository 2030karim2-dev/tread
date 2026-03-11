/**
 * Common Types - الأنواع المشتركة عبر التطبيق
 * أنماط موحدة للأنواع المستخدمة في عدة أماكن
 */

/**
 * حالة التحميل
 */
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

/**
 * الاستجابة المسماة API
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

/**
 * خطأ API
 */
export interface ApiError {
    code: string;
    message: string;
    details?: Record<string, unknown>;
    timestamp: string;
}

/**
 * الفلتر الأساسي
 */
export interface BaseFilter {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

/**
 * فلتر مع التاريخ
 */
export interface DateFilter extends BaseFilter {
    startDate?: string;
    endDate?: string;
}

/**
 * فلتر مع التصنيفات
 */
export interface CategoryFilter extends BaseFilter {
    category?: string;
    categories?: string[];
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

/**
 * استجابة مسماة مع Pagination
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * خيار محدد
 */
export interface SelectOption<T = string> {
    value: T;
    label: string;
    disabled?: boolean;
}

/**
 * عنوان مع وصف
 */
export interface LabelDescription {
    label: string;
    description?: string;
}

/**
 * نطاق التاريخ
 */
export interface DateRange {
    start: Date | null;
    end: Date | null;
}

/**
 * نطاق الأرقام
 */
export interface NumberRange {
    min?: number;
    max?: number;
}

/**
 * الإحصائيات الأساسية
 */
export interface BaseStats {
    total: number;
    count: number;
    average?: number;
}

/**
 * نوع الملف
 */
export type FileType = 'image' | 'document' | 'video' | 'audio' | 'other';

/**
 * حالة الملف
 */
export type FileStatus = 'pending' | 'uploading' | 'uploaded' | 'failed';

/**
 * ملف مرفوع
 */
export interface UploadedFile {
    id: string;
    name: string;
    url: string;
    type: FileType;
    size: number;
    status: FileStatus;
}

/**
 * خيار الترتيب
 */
export interface SortOption {
    value: string;
    label: string;
}

/**
 * Column للجدول
 */
export interface TableColumn<T = unknown> {
    key: keyof T | string;
    header: string;
    sortable?: boolean;
    width?: string;
    render?: (value: unknown, row: T) => React.ReactNode;
}

/**
 * إجراء على العنصر
 */
export interface Action<T = unknown> {
    id: string;
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    disabled?: (item: T) => boolean;
    variant?: 'default' | 'destructive' | 'outline';
}

/**
 * نتيجة التحقق
 */
export interface ValidationResult<T> {
    isValid: boolean;
    data?: T;
    errors: ValidationError[];
}

/**
 * خطأ التحقق
 */
export interface ValidationError {
    field: string;
    message: string;
    code?: string;
}

/**
 * حالة فارغة
 */
export interface EmptyState {
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * تنبيه/إشعار
 */
export interface Notification {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message?: string;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * الإعدادات المفضلة
 */
export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    currency: string;
    dateFormat: string;
    notifications: {
        email: boolean;
        push: boolean;
        sms: boolean;
    };
}
