import { Building2, Car, Coffee, PackageOpen, Users, FileText, Ship, Plane, LucideIcon } from 'lucide-react';

// ===== Status Labels & Styles =====
export const STATUS_LABELS: Record<string, string> = {
  planning: 'مخطط',
  active: 'جارية',
  completed: 'مكتملة',
  purchased: 'تم الشراء',
  production: 'قيد التصنيع',
  at_warehouse: 'في المستودع',
  shipped: 'تم الشحن',
  in_transit: 'في الطريق',
  arrived: 'وصل الميناء',
  delivered: 'تم التسليم',
  // Quotation Statuses (Sourcing Pipeline)
  pending_sourcing: 'قيد البحث والتسعير',
  priced: 'تَسَعَّر للمورد',
  sent_to_customer: 'أُرسل للعميل',
  approved: 'مقبول ومُعْتَمَد',
  rejected: 'مرفوض',
};

export const STATUS_STYLES: Record<string, string> = {
  planning: 'bg-info/15 text-info border-info/30',
  active: 'bg-success/15 text-success border-success/30',
  completed: 'bg-muted text-muted-foreground border-border',
  purchased: 'bg-info/15 text-info border-info/30',
  production: 'bg-purple-500/15 text-purple-600 border-purple-500/30',
  at_warehouse: 'bg-warning/15 text-warning border-warning/30',
  shipped: 'bg-primary/15 text-primary border-primary/30',
  in_transit: 'bg-secondary/15 text-secondary border-secondary/30',
  arrived: 'bg-success/15 text-success border-success/30',
  delivered: 'bg-accent/15 text-accent border-accent/30',
  // Quotation Statuses
  pending_sourcing: 'bg-muted text-muted-foreground border-border',
  priced: 'bg-info/15 text-info border-info/30',
  sent_to_customer: 'bg-primary/15 text-primary border-primary/30',
  approved: 'bg-success/15 text-success border-success/30',
  rejected: 'bg-destructive/15 text-destructive border-destructive/30',
};

// ===== Expense Categories =====
export const EXPENSE_CATEGORIES: Record<string, { label: string; style: string; icon?: LucideIcon }> = {
  hotel:      { label: 'فندق',    style: 'bg-primary/10 text-primary', icon: Building2 },
  transport:  { label: 'تنقلات',  style: 'bg-secondary/10 text-secondary', icon: Car },
  food:       { label: 'طعام',    style: 'bg-accent/10 text-accent', icon: Coffee },
  samples:    { label: 'عينات',   style: 'bg-info/15 text-info', icon: PackageOpen },
  translator: { label: 'مترجم',  style: 'bg-warning/15 text-warning', icon: Users },
  other:      { label: 'أخرى',    style: 'bg-muted text-muted-foreground', icon: FileText },
};

// ===== Currencies =====
export const CURRENCIES = [
  { code: 'CNY', label: 'يوان صيني', symbol: '¥' },
  { code: 'USD', label: 'دولار أمريكي', symbol: '$' },
  { code: 'SAR', label: 'ريال سعودي', symbol: 'ر.س' },
] as const;

export type CurrencyCode = typeof CURRENCIES[number]['code'];

// ===== Shipping Types =====
export const SHIPPING_TYPES = [
  { value: 'sea', label: 'بحري', icon: Ship },
  { value: 'air', label: 'جوي', icon: Plane },
] as const;

export const CONTAINER_TYPES = [
  { value: '20ft', label: 'حاوية 20 قدم', capacity: 28 },
  { value: '40ft', label: 'حاوية 40 قدم', capacity: 58 },
  { value: '40HQ', label: 'حاوية 40 متميزة (HQ)', capacity: 68 },
  { value: 'LCL', label: 'شحن جزئي (LCL)', capacity: 0 },
] as const;

// ===== Empty States =====
export const EMPTY_MESSAGES: Record<string, string> = {
  trips: 'لا توجد رحلات بعد. أضف رحلتك الأولى!',
  suppliers: 'لا يوجد موردين بعد. أضف أول مورد!',
  products: 'لا توجد منتجات بعد. أضف أول منتج!',
  quotations: 'لا توجد عروض أسعار بعد.',
  purchases: 'لا توجد فواتير شراء بعد.',
  sales: 'لا توجد فواتير بيع بعد.',
  shipments: 'لا توجد شحنات بعد.',
  inventory: 'المخزون فارغ.',
  expenses: 'لا توجد مصروفات بعد.',
};
