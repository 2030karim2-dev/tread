// ===== Status Labels & Styles =====
export const STATUS_LABELS: Record<string, string> = {
  planning: 'مخطط',
  active: 'جارية',
  completed: 'مكتملة',
  purchased: 'تم الشراء',
  at_warehouse: 'في المستودع',
  shipped: 'تم الشحن',
  in_transit: 'في الطريق',
  arrived: 'وصل الميناء',
  delivered: 'تم التسليم',
};

export const STATUS_STYLES: Record<string, string> = {
  planning: 'bg-info/15 text-info border-info/30',
  active: 'bg-success/15 text-success border-success/30',
  completed: 'bg-muted text-muted-foreground border-border',
  purchased: 'bg-info/15 text-info border-info/30',
  at_warehouse: 'bg-warning/15 text-warning border-warning/30',
  shipped: 'bg-primary/15 text-primary border-primary/30',
  in_transit: 'bg-secondary/15 text-secondary border-secondary/30',
  arrived: 'bg-success/15 text-success border-success/30',
  delivered: 'bg-accent/15 text-accent border-accent/30',
};

// ===== Expense Categories =====
export const EXPENSE_CATEGORIES: Record<string, { label: string; style: string }> = {
  hotel:      { label: '🏨 فندق',    style: 'bg-primary/10 text-primary' },
  transport:  { label: '🚗 تنقلات',  style: 'bg-secondary/10 text-secondary' },
  food:       { label: '🍜 طعام',    style: 'bg-accent/10 text-accent' },
  samples:    { label: '📦 عينات',   style: 'bg-info/15 text-info' },
  translator: { label: '🗣️ مترجم',  style: 'bg-warning/15 text-warning' },
  other:      { label: '📋 أخرى',    style: 'bg-muted text-muted-foreground' },
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
  { value: 'sea', label: '🚢 بحري' },
  { value: 'air', label: '✈️ جوي' },
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
