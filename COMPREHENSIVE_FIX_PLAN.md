# خطة الإصلاح الشاملة - Trade Navigator

## ملخص الخطة

هذه الخطة تحدد جميع الإصلاحات المطلوبة للمشاكل المكتشفة في تقرير التدقيق الشامل، مع تصنيفها حسب الأولوية وتقسيمها إلى مراحل زمنية قابلة للتنفيذ.

---

## 1. تصنيف المشاكل حسب الأولوية والتأثير

### 🔴 حرجة (Critical) - تؤثر على استقرار التطبيق
| المشكلة | التأثير | الموقع | الأولوية |
|---------|---------|--------|----------|
| أخطاء TypeScript غير مُعالجة | توقف التطبيق | متعدد | P0 |
| عدم معالجة الأخطاء | توقف التطبيق | متعدد | P0 |
| ثغرات أمنية (XSS) | اختراق البيانات | EditableTable.tsx | P0 |

### 🟠 عالية (High) - تؤثر على الأداء والتجربة
| المشكلة | التأثير | الموقع | الأولوية |
|---------|---------|--------|----------|
| عدم استخدام useMemo/useCallback | بطء الأداء | متعدد | P1 |
| عدم استخدام React.memo | إعادة تصيير زائدة | مكونات مشتركة | P1 |
| عدم وجود اختبارات | صعوبة الصيانة | المشروع كاملاً | P1 |
| عدم استخدام ARIA labels | إمكانية الوصول | متعدد | P1 |

### 🟡 متوسطة (Medium) - تؤثر على جودة الكود
| المشكلة | التأثير | الموقع | الأولوية |
|---------|---------|--------|----------|
| مكونات كبيرة (انتهاك SRP) | صعوبة الصيانة | AppLayout.tsx | P2 |
| عدم استخدام virtualization | بطء القوائم | Pages | P2 |
| عدم تشفير البيانات | أمان | useAppStore.ts | P2 |

### 🟢 منخفضة (Low) - تحسينات مستقبلية
| المشكلة | التأثير | الموقع | الأولوية |
|---------|---------|--------|----------|
| تحسين التوثيق | تجربة المطور | المشروع | P3 |
| إضافة CI/CD | جودة الكود | المشروع | P3 |
| تحسين بنية المشروع | قابلية التوسع | المشروع | P3 |

---

## 2. المراحل الزمنية للإصلاح

### المرحلة 1: إصلاحات حرجة (أسبوع 1)
**الهدف**: إصلاح المشاكل التي تؤثر على استقرار التطبيق

#### 1.1 إصلاح أخطاء TypeScript

##### المشكلة 1: استخدام `any` غير مبرر
**الموقع**: [`src/pages/QuotationsPage.tsx:85`](src/pages/QuotationsPage.tsx:85)

**الوصف**: استخدام type assertion غير آمن عند تحديث عناصر النموذج

**الحل المقترح**:
```typescript
// قبل
const updateItem = (idx: number, field: keyof QuotationItem, value: string | number) => {
  const updated = [...formItems];
  (updated[idx] as Record<string, unknown>)[field] = value;
  setFormItems(updated);
};

// بعد
const updateItem = (idx: number, field: keyof QuotationItem, value: string | number) => {
  const updated = [...formItems];
  const currentItem = updated[idx];
  if (!currentItem) return;
  
  const updatedItem: QuotationItem = {
    ...currentItem,
    [field]: value,
  };
  updated[idx] = updatedItem;
  setFormItems(updated);
};
```

##### المشكلة 2: عدم التحقق من undefined
**الموقع**: [`src/pages/PurchasesPage.tsx:300`](src/pages/PurchasesPage.tsx:300)

**الوصف**: الوصول إلى مصفوفة بدون التحقق من وجود العناصر

**الحل المقترح**:
```typescript
// قبل
<th className="text-center py-2 px-2 font-bold">
  {getSupplierName(comparedQuotations[0].supplier_id)}
</th>

// بعد
<th className="text-center py-2 px-2 font-bold">
  {comparedQuotations[0] ? getSupplierName(comparedQuotations[0].supplier_id) : '—'}
</th>
```

##### المشكلة 3: عدم التوافق بين الأنواع
**الموقع**: [`src/pages/ExpensesPage.tsx:44`](src/pages/ExpensesPage.tsx:44)

**الوصف**: استدعاء دالة قد ترمي استثناءً بدون معالجة

**الحل المقترح**:
```typescript
// قبل
const totalUSD = filteredExpenses.filter(e => e.currency === 'USD').reduce((s, e) => s + e.amount, 0) + convertCurrency(totalCNY, 'CNY', 'USD');

// بعد
const totalUSD = useMemo(() => {
  const usdExpenses = filteredExpenses
    .filter(e => e.currency === 'USD')
    .reduce((s, e) => s + e.amount, 0);
  
  try {
    const convertedCNY = convertCurrency(totalCNY, 'CNY', 'USD');
    return usdExpenses + convertedCNY;
  } catch (error) {
    console.error('Currency conversion error:', error);
    return usdExpenses;
  }
}, [filteredExpenses, totalCNY]);
```

#### 1.2 إضافة Error Boundaries متعددة

**الموقع**: [`src/App.tsx`](src/App.tsx)

**الوصف**: Error Boundary واحد فقط يغطي التطبيق بالكامل

**الحل المقترح**:
```typescript
// إنشاء Error Boundary مخصص لكل قسم
import { ErrorBoundary } from '@/components/shared/ErrorBoundary';

// في App.tsx
<QueryClientProvider client={queryClient}>
  <MarketModeSync />
  <TooltipProvider>
    <Sonner />
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <MobileProvider>
        <OnboardingDialog />
        <AppLayout>
          <ErrorBoundary fallback={<PageErrorFallback />}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={
                  <ErrorBoundary fallback={<DashboardErrorFallback />}>
                    <Dashboard />
                  </ErrorBoundary>
                } />
                {/* باقي المسارات */}
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AppLayout>
      </MobileProvider>
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

#### 1.3 تحسين معالجة الأخطاء

**الموقع**: [`src/lib/currency.ts`](src/lib/currency.ts)

**الوصف**: دالة `convertCurrency` قد ترمي استثناءً بدون معالجة

**الحل المقترح**:
```typescript
// إضافة دالة آمنة للتحويل
export function safeConvertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode,
  fallback: number = 0
): number {
  try {
    return convertCurrency(amount, from, to);
  } catch (error) {
    console.error('Currency conversion failed:', error);
    return fallback;
  }
}

// استخدام الدالة الآمنة في المكونات
const totalUSD = safeConvertCurrency(totalCNY, 'CNY', 'USD', totalCNY * 0.14);
```

---

### المرحلة 2: تحسينات الأداء (أسبوع 2-3)
**الهدف**: تحسين أداء التطبيق وتقليل إعادة التصيير

#### 2.1 استخدام React.memo للمكونات الثقيلة

##### المكون 1: EditableTable
**الموقع**: [`src/components/shared/EditableTable.tsx`](src/components/shared/EditableTable.tsx)

**الحل المقترح**:
```typescript
import { memo, ReactNode, useCallback, useRef } from 'react';

export interface ColumnDef<T> {
  key: string;
  header: string;
  minWidth?: string;
  type?: 'text' | 'number' | 'custom';
  editable?: boolean;
  align?: 'left' | 'center' | 'right';
  mono?: boolean;
  render?: (row: T, index: number) => ReactNode;
}

interface EditableTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onCellChange?: (id: string, field: string, value: string | number) => void;
  onDeleteRow?: (id: string) => void;
  showRowNumbers?: boolean;
  footer?: ReactNode;
}

export const EditableTable = memo(function EditableTable<T extends { id: string }>({
  data,
  columns,
  onCellChange,
  onDeleteRow,
  showRowNumbers = true,
  footer,
}: EditableTableProps<T>) {
  // implementation
}) as <T extends { id: string }>(props: EditableTableProps<T>) => JSX.Element;
```

##### المكون 2: SearchBar
**الموقع**: [`src/components/shared/SearchBar.tsx`](src/components/shared/SearchBar.tsx)

**الحل المقترح**:
```typescript
import { memo, useState, useRef, useMemo } from 'react';

export const SearchBar = memo(function SearchBar({
  placeholder = 'بحث...',
  value,
  onChange,
  filters,
  actionButton,
}: SearchBarProps) {
  // implementation
});
```

#### 2.2 استخدام useMemo للقوائم المفلترة

##### الصفحة 1: ExpensesPage
**الموقع**: [`src/pages/ExpensesPage.tsx`](src/pages/ExpensesPage.tsx)

**الحل المقترح**:
```typescript
// قبل
const totalCNY = filteredExpenses.filter(e => e.currency === 'CNY').reduce((s, e) => s + e.amount, 0);
const totalUSD = filteredExpenses.filter(e => e.currency === 'USD').reduce((s, e) => s + e.amount, 0) + convertCurrency(totalCNY, 'CNY', 'USD');
const totalSAR = filteredExpenses.filter(e => e.currency === 'SAR').reduce((s, e) => s + e.amount, 0);

// بعد
const { totalCNY, totalUSD, totalSAR } = useMemo(() => {
  const totals = filteredExpenses.reduce(
    (acc, expense) => {
      switch (expense.currency) {
        case 'CNY':
          acc.totalCNY += expense.amount;
          break;
        case 'USD':
          acc.totalUSD += expense.amount;
          break;
        case 'SAR':
          acc.totalSAR += expense.amount;
          break;
      }
      return acc;
    },
    { totalCNY: 0, totalUSD: 0, totalSAR: 0 }
  );

  try {
    totals.totalUSD += convertCurrency(totals.totalCNY, 'CNY', 'USD');
  } catch (error) {
    console.error('Currency conversion error:', error);
  }

  return totals;
}, [filteredExpenses]);
```

##### الصفحة 2: ProductsPage
**الموقع**: [`src/pages/ProductsPage.tsx`](src/pages/ProductsPage.tsx)

**الحل المقترح**:
```typescript
// قبل
const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);

// بعد
const brands = useMemo(() => {
  const brandSet = new Set<string>();
  products.forEach(product => {
    if (product.brand) {
      brandSet.add(product.brand);
    }
  });
  return Array.from(brandSet).sort();
}, [products]);
```

#### 2.3 استخدام useCallback للدوال المعقدة

##### الدالة 1: handleAdd في ExpensesPage
**الموقع**: [`src/pages/ExpensesPage.tsx:47`](src/pages/ExpensesPage.tsx:47)

**الحل المقترح**:
```typescript
// قبل
const handleAdd = () => {
  const parsed = { ...form, amount: Number(form.amount) };
  const result = expenseSchema.safeParse(parsed);
  // ...
};

// بعد
const handleAdd = useCallback(() => {
  const parsed = { ...form, amount: Number(form.amount) };
  const result = expenseSchema.safeParse(parsed);
  
  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    result.error.issues.forEach(issue => {
      const path = issue.path[0];
      if (typeof path === 'string') {
        fieldErrors[path] = issue.message;
      }
    });
    setErrors(fieldErrors);
    return;
  }

  if (editingExpense) {
    updateExpense(editingExpense.id, result.data as Partial<Expense>);
    toast({ title: 'تم التحديث', description: 'تم تحديث المصروف بنجاح' });
  } else {
    addExpense({ trip_id: '1', ...result.data } as Omit<Expense, 'id'>);
    toast({ title: 'تمت الإضافة', description: 'تم إضافة المصروف بنجاح' });
  }

  setForm(emptyForm);
  setErrors({});
  setEditingExpense(null);
  setOpen(false);
}, [form, editingExpense, updateExpense, addExpense, toast]);
```

---

### المرحلة 3: اختبارات الوحدات (أسبوع 4-5)
**الهدف**: إضافة اختبارات للوظائف الحرجة

#### 3.1 اختبارات Store Actions

**الموقع**: `src/store/useAppStore.ts`

**الحل المقترح**:
```typescript
// src/store/__tests__/useAppStore.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAppStore } from '../useAppStore';

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.trips = [];
      result.current.suppliers = [];
      result.current.products = [];
    });
  });

  describe('Trip Actions', () => {
    it('should add a trip', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.addTrip({
          name: 'Test Trip',
          country: 'China',
          city: 'Guangzhou',
          start_date: '2025-01-01',
          end_date: '2025-01-10',
          notes: 'Test notes',
          status: 'planning',
        });
      });

      expect(result.current.trips).toHaveLength(1);
      expect(result.current.trips[0].name).toBe('Test Trip');
    });

    it('should update a trip', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.addTrip({
          name: 'Test Trip',
          country: 'China',
          city: 'Guangzhou',
          start_date: '2025-01-01',
          end_date: '2025-01-10',
          notes: '',
          status: 'planning',
        });
      });

      const tripId = result.current.trips[0].id;

      act(() => {
        result.current.updateTrip(tripId, { status: 'active' });
      });

      expect(result.current.trips[0].status).toBe('active');
    });

    it('should delete a trip', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.addTrip({
          name: 'Test Trip',
          country: 'China',
          city: 'Guangzhou',
          start_date: '2025-01-01',
          end_date: '2025-01-10',
          notes: '',
          status: 'planning',
        });
      });

      const tripId = result.current.trips[0].id;

      act(() => {
        result.current.deleteTrip(tripId);
      });

      expect(result.current.trips).toHaveLength(0);
    });
  });

  describe('Supplier Actions', () => {
    it('should add a supplier', () => {
      const { result } = renderHook(() => useAppStore());
      
      act(() => {
        result.current.addSupplier({
          name: 'Test Supplier',
          company_name: 'Test Company',
          city: 'Guangzhou',
          phone: '+86 123 456 7890',
          wechat_or_whatsapp: 'test123',
          product_category: 'Auto Parts',
          rating: 0,
          notes: '',
          trip_id: '1',
        });
      });

      expect(result.current.suppliers).toHaveLength(1);
      expect(result.current.suppliers[0].name).toBe('Test Supplier');
    });
  });
});
```

#### 3.2 اختبارات Utility Functions

**الموقع**: `src/lib/currency.ts`

**الحل المقترح**:
```typescript
// src/lib/__tests__/currency.test.ts
import { convertCurrency, formatCurrency, getCurrencySymbol, isValidCurrency } from '../currency';

describe('Currency Utilities', () => {
  describe('convertCurrency', () => {
    it('should convert CNY to USD correctly', () => {
      const result = convertCurrency(100, 'CNY', 'USD');
      expect(result).toBe(14);
    });

    it('should convert USD to CNY correctly', () => {
      const result = convertCurrency(14, 'USD', 'CNY');
      expect(result).toBe(100.1);
    });

    it('should return same amount for same currency', () => {
      const result = convertCurrency(100, 'USD', 'USD');
      expect(result).toBe(100);
    });

    it('should throw error for invalid amount', () => {
      expect(() => convertCurrency(NaN, 'CNY', 'USD')).toThrow();
      expect(() => convertCurrency(-100, 'CNY', 'USD')).toThrow();
    });
  });

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      const result = formatCurrency(1234.56, 'USD');
      expect(result).toBe('$1,234.56');
    });

    it('should format CNY correctly', () => {
      const result = formatCurrency(1234.56, 'CNY');
      expect(result).toBe('¥1,234.56');
    });

    it('should format SAR correctly', () => {
      const result = formatCurrency(1234.56, 'SAR');
      expect(result).toBe('ر.س1,234.56');
    });
  });

  describe('getCurrencySymbol', () => {
    it('should return correct symbol for USD', () => {
      expect(getCurrencySymbol('USD')).toBe('$');
    });

    it('should return correct symbol for CNY', () => {
      expect(getCurrencySymbol('CNY')).toBe('¥');
    });

    it('should return correct symbol for SAR', () => {
      expect(getCurrencySymbol('SAR')).toBe('ر.س');
    });
  });

  describe('isValidCurrency', () => {
    it('should return true for valid currencies', () => {
      expect(isValidCurrency('USD')).toBe(true);
      expect(isValidCurrency('CNY')).toBe(true);
      expect(isValidCurrency('SAR')).toBe(true);
    });

    it('should return false for invalid currencies', () => {
      expect(isValidCurrency('EUR')).toBe(false);
      expect(isValidCurrency('GBP')).toBe(false);
    });
  });
});
```

#### 3.3 اختبارات Validation

**الموقع**: `src/lib/validation.ts`

**الحل المقترح**:
```typescript
// src/lib/__tests__/validation.test.ts
import { tripSchema, supplierSchema, expenseSchema, validate } from '../validation';

describe('Validation Schemas', () => {
  describe('tripSchema', () => {
    it('should validate a valid trip', () => {
      const validTrip = {
        name: 'Test Trip',
        country: 'China',
        city: 'Guangzhou',
        start_date: '2025-01-01',
        end_date: '2025-01-10',
        notes: 'Test notes',
      };

      const result = tripSchema.safeParse(validTrip);
      expect(result.success).toBe(true);
    });

    it('should reject trip without name', () => {
      const invalidTrip = {
        name: '',
        country: 'China',
        city: 'Guangzhou',
        start_date: '2025-01-01',
        end_date: '2025-01-10',
      };

      const result = tripSchema.safeParse(invalidTrip);
      expect(result.success).toBe(false);
    });

    it('should reject trip without country', () => {
      const invalidTrip = {
        name: 'Test Trip',
        country: '',
        city: 'Guangzhou',
        start_date: '2025-01-01',
        end_date: '2025-01-10',
      };

      const result = tripSchema.safeParse(invalidTrip);
      expect(result.success).toBe(false);
    });
  });

  describe('supplierSchema', () => {
    it('should validate a valid supplier', () => {
      const validSupplier = {
        name: 'Test Supplier',
        company_name: 'Test Company',
        city: 'Guangzhou',
        phone: '+86 123 456 7890',
        wechat_or_whatsapp: 'test123',
        product_category: 'Auto Parts',
        notes: '',
      };

      const result = supplierSchema.safeParse(validSupplier);
      expect(result.success).toBe(true);
    });

    it('should reject supplier without name', () => {
      const invalidSupplier = {
        name: '',
        company_name: 'Test Company',
        city: 'Guangzhou',
        phone: '+86 123 456 7890',
        product_category: 'Auto Parts',
      };

      const result = supplierSchema.safeParse(invalidSupplier);
      expect(result.success).toBe(false);
    });
  });

  describe('expenseSchema', () => {
    it('should validate a valid expense', () => {
      const validExpense = {
        category: 'hotel',
        amount: 100,
        currency: 'CNY',
        date: '2025-01-01',
        notes: 'Hotel expense',
      };

      const result = expenseSchema.safeParse(validExpense);
      expect(result.success).toBe(true);
    });

    it('should reject expense with invalid category', () => {
      const invalidExpense = {
        category: 'invalid',
        amount: 100,
        currency: 'CNY',
        date: '2025-01-01',
      };

      const result = expenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });

    it('should reject expense with negative amount', () => {
      const invalidExpense = {
        category: 'hotel',
        amount: -100,
        currency: 'CNY',
        date: '2025-01-01',
      };

      const result = expenseSchema.safeParse(invalidExpense);
      expect(result.success).toBe(false);
    });
  });

  describe('validate helper', () => {
    it('should return valid result for valid data', () => {
      const validTrip = {
        name: 'Test Trip',
        country: 'China',
        city: 'Guangzhou',
        start_date: '2025-01-01',
        end_date: '2025-01-10',
      };

      const result = validate(tripSchema, validTrip);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return errors for invalid data', () => {
      const invalidTrip = {
        name: '',
        country: '',
        city: '',
        start_date: '',
        end_date: '',
      };

      const result = validate(tripSchema, invalidTrip);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
});
```

---

### المرحلة 4: تحسينات إمكانية الوصول (أسبوع 6)
**الهدف**: تحسين تجربة المستخدم لذوي الاحتياجات الخاصة

#### 4.1 إضافة ARIA labels

##### المكون 1: EditableTable
**الموقع**: [`src/components/shared/EditableTable.tsx`](src/components/shared/EditableTable.tsx)

**الحل المقترح**:
```typescript
// إضافة ARIA labels للأزرار والحقول
<td className="spreadsheet-cell text-center">
  <button
    onClick={() => onDeleteRow(row.id)}
    aria-label={`حذف الصف ${rowIdx + 1}`}
    aria-describedby={`row-${row.id}-description`}
    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-destructive/10 text-destructive"
  >
    <Trash2 className="w-3.5 h-3.5" />
  </button>
</td>

// إضافة وصف للصف
<tr 
  key={row.id} 
  className="group hover:bg-muted/30 transition-colors"
  aria-label={`صف ${rowIdx + 1}`}
>
```

##### المكون 2: SearchBar
**الموقع**: [`src/components/shared/SearchBar.tsx`](src/components/shared/SearchBar.tsx)

**الحل المقترح**:
```typescript
// إضافة ARIA labels للبحث والفلاتر
<div className="relative flex-1">
  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
  <input
    ref={inputRef}
    type="text"
    value={value}
    onChange={e => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label="بحث"
    aria-describedby="search-description"
    className="w-full pl-10 pr-10 py-2.5 bg-card rounded-xl border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
  />
  <span id="search-description" className="sr-only">
    ابحث في القائمة الحالية
  </span>
</div>
```

#### 4.2 إضافة skip links

**الموقع**: [`src/App.tsx`](src/App.tsx)

**الحل المقترح**:
```typescript
// إضافة skip links في بداية التطبيق
function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MarketModeSync />
      <TooltipProvider>
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <MobileProvider>
            {/* Skip Links */}
            <a 
              href="#main-content" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-4 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg"
            >
              تخطي إلى المحتوى الرئيسي
            </a>
            <a 
              href="#sidebar-nav" 
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:right-40 focus:z-50 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg"
            >
              تخطي إلى التنقل
            </a>
            
            <OnboardingDialog />
            <AppLayout>
              <ErrorBoundary>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    {/* routes */}
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </AppLayout>
          </MobileProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
```

#### 4.3 تحسين keyboard navigation

**الموقع**: [`src/components/layout/AppLayout.tsx`](src/components/layout/AppLayout.tsx)

**الحل المقترح**:
```typescript
// إضافة دعم keyboard navigation للتنقل
function SidebarNav({ items, onNavigate }: { items: typeof navGroups; onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="space-y-3 sm:space-y-5" role="navigation" aria-label="التنقل الرئيسي">
      {items.map(group => (
        <div key={group.label}>
          <p className="px-5 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30">
            {group.label}
          </p>
          {group.items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigate?.();
                  }
                }}
                className={`flex flex-col items-center gap-1 px-1 sm:px-2 py-1.5 sm:py-2 mx-0.5 sm:mx-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-secondary shadow-colored-secondary text-secondary-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
                aria-current={isActive ? 'page' : undefined}
                tabIndex={0}
              >
                <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? '' : 'opacity-70'}`} aria-hidden="true" />
                <motion.span 
                  animate={isActive ? { 
                    scale: [1, 1.05, 1],
                    color: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)']
                  } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                  className="truncate w-full text-center px-1"
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

---

### المرحلة 5: تحسينات الأمان (أسبوع 7)
**الهدف**: تحسين أمان التطبيق وحماية البيانات

#### 5.1 تشفير البيانات الحساسة

**الموقع**: [`src/store/useAppStore.ts`](src/store/useAppStore.ts)

**الحل المقترح**:
```typescript
// إنشاء خدمة تشفير
// src/lib/encryption.ts
import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'default-key-change-in-production';

export function encryptData(data: unknown): string {
  const jsonString = JSON.stringify(data);
  return CryptoJS.AES.encrypt(jsonString, ENCRYPTION_KEY).toString();
}

export function decryptData<T>(encrypted: string): T | null {
  try {
    const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
    const decrypted = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decrypted) as T;
  } catch (error) {
    console.error('Decryption failed:', error);
    return null;
  }
}

// تحديث useAppStore لاستخدام التشفير
import { encryptData, decryptData } from '@/lib/encryption';

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // ... state
    }),
    {
      name: 'trade-navigator-store',
      version: 1,
      storage: createJSONStorage(() => ({
        getItem: (name: string) => {
          const item = localStorage.getItem(name);
          if (!item) return null;
          return decryptData(item);
        },
        setItem: (name: string, value: unknown) => {
          const encrypted = encryptData(value);
          localStorage.setItem(name, encrypted);
        },
        removeItem: (name: string) => {
          localStorage.removeItem(name);
        },
      })),
    }
  )
);
```

#### 5.2 تنقية المدخلات

**الموقع**: [`src/components/shared/EditableTable.tsx`](src/components/shared/EditableTable.tsx)

**الحل المقترح**:
```typescript
// إنشاء دالة تنقية
// src/lib/sanitize.ts
import DOMPurify from 'dompurify';

export function sanitizeInput(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // لا تسمح بأي HTML tags
    ALLOWED_ATTR: [], // لا تسمح بأي attributes
  });
}

export function sanitizeObject<T extends Record<string, unknown>>(obj: T): T {
  const sanitized = { ...obj };
  for (const key in sanitized) {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key] as string) as T[Extract<keyof T, string>];
    }
  }
  return sanitized;
}

// استخدام الدالة في EditableTable
import { sanitizeInput } from '@/lib/sanitize';

// في render function
<td className={`spreadsheet-cell text-sm ${col.align === 'center' ? 'text-center' : ''} ${col.mono ? 'font-mono' : ''}`}>
  {sanitizeInput(String(value ?? ''))}
</td>
```

#### 5.3 إضافة Content Security Policy

**الموقع**: [`index.html`](index.html)

**الحل المقترح**:
```html
<!DOCTYPE html>
<html lang="ar" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <meta name="theme-color" content="#0f172a" />
    <meta name="description" content="نظام إدارة الاستيراد - AutoParts" />
    <link rel="apple-touch-icon" href="/icons/icon.svg" />
    <title>AutoParts - نظام إدارة الاستيراد</title>
    
    <!-- Content Security Policy -->
    <meta http-equiv="Content-Security-Policy" content="
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.exchangerate-api.com;
      frame-src 'self';
      object-src 'none';
    ">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

### المرحلة 6: تحسينات إضافية (أسبوع 8)
**الهدف**: تحسينات إضافية لجودة الكود

#### 6.1 تقسيم المكونات الكبيرة

##### المكون: AppLayout
**الموقع**: [`src/components/layout/AppLayout.tsx`](src/components/layout/AppLayout.tsx)

**الحل المقترح**:
```typescript
// تقسيم AppLayout إلى مكونات فرعية
// src/components/layout/Sidebar.tsx
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface SidebarProps {
  navGroups: Array<{
    label: string;
    items: Array<{
      path: string;
      label: string;
      icon: React.ElementType;
    }>;
  }>;
  isCollapsed: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ navGroups, isCollapsed, onNavigate }: SidebarProps) {
  const location = useLocation();

  return (
    <motion.aside 
      initial={false}
      animate={{ 
        width: isCollapsed ? 64 : 150,
      }}
      className="hidden lg:flex flex-col gradient-sidebar fixed inset-y-0 right-0 z-40 border-l border-sidebar-border/50 overflow-hidden shadow-2xl transition-all duration-300"
    >
      {/* Logo */}
      <div className="p-3 pb-2 flex flex-col items-center gap-1 text-center">
        <div className="w-8 h-8 rounded-lg gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden shrink-0">
          <img src={logoImg} alt="Logo" className="w-5 h-5 object-contain" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-xs font-extrabold text-sidebar-foreground tracking-tight whitespace-nowrap">
              Auto<span className="text-secondary">Parts</span>
            </h1>
          </div>
        )}
      </div>

      <div className="mx-4 mb-3 h-px bg-sidebar-border/50" />

      {/* Nav */}
      <nav className="flex-1 py-1 overflow-y-auto" id="sidebar-nav">
        <SidebarNav items={navGroups} />
      </nav>

      {/* Keyboard shortcuts hint */}
      {!isCollapsed && (
        <div className="mx-4 px-3 py-2 bg-sidebar-accent/50 rounded-lg mb-2">
          <p className="text-[10px] text-sidebar-foreground/40 text-center whitespace-nowrap">
            اضغط <kbd className="bg-sidebar-accent px-1 rounded text-[10px] font-mono">Alt+/</kbd> لعرض الاختصارات
          </p>
        </div>
      )}

      {/* Bottom */}
      <div className="mx-4 h-px bg-sidebar-border/50" />
      <div className="p-3">
        <div className={`flex items-center justify-center gap-3 p-2.5 rounded-lg bg-sidebar-accent/50 ${isCollapsed ? 'px-0' : ''}`}>
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
            م
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-sidebar-foreground truncate">مدير النظام</p>
                <p className="text-[10px] text-sidebar-foreground/40 truncate">الخطة المجانية</p>
              </div>
              <Settings className="w-4 h-4 text-sidebar-foreground/40 shrink-0" />
            </>
          )}
        </div>
      </div>
    </motion.aside>
  );
}

// src/components/layout/Header.tsx
import { ReactNode } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Menu, Home, ChevronLeft } from 'lucide-react';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { QuickSearch } from './QuickSearch';

interface HeaderProps {
  currentPage: string;
  onMenuClick: () => void;
}

export function Header({ currentPage, onMenuClick }: HeaderProps) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-l from-primary/5 via-background/95 to-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm">
      <div className="px-3 lg:px-5 py-1.5 flex items-center gap-2">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-1.5 -mr-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
          aria-label="فتح القائمة"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Page title + breadcrumbs */}
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold leading-tight">{currentPage}</h2>
          <InlineBreadcrumbs currentPath={location.pathname} pageName={currentPage} />
        </div>

        {/* Quick nav shortcuts (desktop only) */}
        <div className="hidden lg:flex items-center gap-1 mr-2">
          {/* shortcuts */}
        </div>

        {/* Search */}
        <QuickSearch />

        {/* Notifications */}
        <NotificationBell />
      </div>
    </header>
  );
}

// تحديث AppLayout لاستخدام المكونات الفرعية
export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useKeyboardShortcuts();

  const currentPage = allItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم';

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Desktop Sidebar */}
      <Sidebar 
        navGroups={navGroups} 
        isCollapsed={isCollapsed} 
      />

      {/* Desktop Sidebar Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden lg:flex fixed top-4 z-50 p-2 rounded-full gradient-secondary text-secondary-foreground shadow-lg transition-all duration-300 ${
          isCollapsed ? 'right-[48px] -translate-x-1/2 rotate-180' : 'right-[150px] -translate-x-1/2'
        }`}
        aria-label={isCollapsed ? 'توسيع الشريط الجانبي' : 'طي الشريط الجانبي'}
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
          <X className={`w-4 h-4 ${isCollapsed ? 'hidden' : ''}`} />
          <Menu className={`w-4 h-4 ${isCollapsed ? '' : 'hidden'}`} />
        </motion.div>
      </button>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: 150 }}
              animate={{ x: 0 }}
              exit={{ x: 150 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[150px] gradient-sidebar z-50 lg:hidden shadow-2xl"
            >
              {/* Mobile sidebar content */}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className={`flex-1 min-w-0 transition-[margin] duration-300 ${
          isCollapsed ? 'lg:mr-[64px]' : 'lg:mr-[150px]'
        }`}
        id="main-content"
      >
        <Header 
          currentPage={currentPage} 
          onMenuClick={() => setSidebarOpen(true)} 
        />

        {/* Page Content */}
        <div className="px-2 sm:px-3 lg:px-5 pt-2 pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-2xl border-t border-border/60 z-30 safe-area-bottom">
        {/* bottom nav content */}
      </nav>
    </div>
  );
}
```

#### 6.2 إضافة virtualization للقوائم الطويلة

**الموقع**: [`src/pages/ExpensesPage.tsx`](src/pages/ExpensesPage.tsx)

**الحل المقترح**:
```typescript
// تثبيت react-window
// npm install react-window @types/react-window

import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-window-auto-sizer';

// في المكون
{filteredExpenses.length === 0 ? (
  <EmptyState message={search || categoryFilter !== 'all' || currencyFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا توجد مصروفات بعد.'} />
) : (
  <div className="h-[600px]">
    <AutoSizer>
      {({ height, width }) => (
        <List
          height={height}
          itemCount={filteredExpenses.length}
          itemSize={80}
          width={width}
          itemData={filteredExpenses}
        >
          {({ index, style }) => {
            const exp = filteredExpenses[index];
            const cat = EXPENSE_CATEGORIES[exp.category];
            return (
              <motion.div
                style={style}
                key={exp.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                className="group bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-between"
              >
                {/* content */}
              </motion.div>
            );
          }}
        </List>
      )}
    </AutoSizer>
  </div>
)}
```

---

## 3. توصيات لمنع تكرار الأخطاء

### 3.1 أفضل الممارسات لـ TypeScript

#### 1. استخدام strict mode
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

#### 2. تجنب استخدام `any`
```typescript
// ❌ سيء
const data: any = fetchData();

// ✅ جيد
interface Data {
  id: string;
  name: string;
}
const data: Data = fetchData();
```

#### 3. استخدام type guards
```typescript
// ❌ سيء
function processValue(value: unknown) {
  return (value as string).toUpperCase();
}

// ✅ جيد
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function processValue(value: unknown) {
  if (isString(value)) {
    return value.toUpperCase();
  }
  throw new Error('Value is not a string');
}
```

### 3.2 أفضل الممارسات لـ React

#### 1. استخدام memo للمكونات
```typescript
// ❌ سيء
export function MyComponent({ data }: MyComponentProps) {
  return <div>{data}</div>;
}

// ✅ جيد
export const MyComponent = memo(function MyComponent({ data }: MyComponentProps) {
  return <div>{data}</div>;
});
```

#### 2. استخدام useMemo للحسابات المعقدة
```typescript
// ❌ سيء
function MyComponent({ items }: MyComponentProps) {
  const filtered = items.filter(item => item.active);
  return <div>{filtered.length}</div>;
}

// ✅ جيد
function MyComponent({ items }: MyComponentProps) {
  const filtered = useMemo(() => 
    items.filter(item => item.active),
    [items]
  );
  return <div>{filtered.length}</div>;
}
```

#### 3. استخدام useCallback للدوال
```typescript
// ❌ سيء
function MyComponent({ onClick }: MyComponentProps) {
  const handleClick = () => {
    onClick();
  };
  return <button onClick={handleClick}>Click</button>;
}

// ✅ جيد
function MyComponent({ onClick }: MyComponentProps) {
  const handleClick = useCallback(() => {
    onClick();
  }, [onClick]);
  return <button onClick={handleClick}>Click</button>;
}
```

### 3.3 أفضل الممارسات للأمان

#### 1. تنقية المدخلات
```typescript
// ❌ سيء
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ جيد
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

#### 2. تشفير البيانات الحساسة
```typescript
// ❌ سيء
localStorage.setItem('user', JSON.stringify(userData));

// ✅ جيد
import { encryptData } from '@/lib/encryption';
localStorage.setItem('user', encryptData(userData));
```

#### 3. استخدام environment variables
```typescript
// ❌ سيء
const API_KEY = 'my-secret-key';

// ✅ جيد
const API_KEY = import.meta.env.VITE_API_KEY;
```

### 3.4 أفضل الممارسات للاختبارات

#### 1. اختبار جميع المسارات
```typescript
// ❌ سيء
it('should add item', () => {
  // test only happy path
});

// ✅ جيد
it('should add item', () => {
  // test happy path
});

it('should handle errors', () => {
  // test error path
});

it('should validate input', () => {
  // test validation
});
```

#### 2. استخدام descriptive names
```typescript
// ❌ سيء
it('test1', () => {
  // test
});

// ✅ جيد
it('should add a trip when valid data is provided', () => {
  // test
});
```

---

## 4. ملخص المراحل الزمنية

| المرحلة | المدة | الهدف | المكونات المتأثرة |
|---------|-------|-------|-------------------|
| 1 | أسبوع 1 | إصلاحات حرجة | QuotationsPage, PurchasesPage, ExpensesPage, currency.ts, App.tsx |
| 2 | أسبوع 2-3 | تحسينات الأداء | EditableTable, SearchBar, ExpensesPage, ProductsPage |
| 3 | أسبوع 4-5 | اختبارات | useAppStore, currency.ts, validation.ts |
| 4 | أسبوع 6 | إمكانية الوصول | EditableTable, SearchBar, App.tsx, AppLayout.tsx |
| 5 | أسبوع 7 | تحسينات الأمان | useAppStore.ts, EditableTable.tsx, index.html |
| 6 | أسبوع 8 | تحسينات إضافية | AppLayout.tsx, ExpensesPage.tsx |

---

## 5. أدوات المطلوبة

### التبعيات الجديدة
```json
{
  "dependencies": {
    "dompurify": "^3.0.0",
    "crypto-js": "^4.2.0",
    "react-window": "^1.8.0",
    "react-window-auto-sizer": "^1.0.0"
  },
  "devDependencies": {
    "@types/dompurify": "^3.0.0",
    "@types/crypto-js": "^4.2.0",
    "@types/react-window": "^1.8.0"
  }
}
```

### أدوات التطوير
```json
{
  "devDependencies": {
    "husky": "^9.0.0",
    "lint-staged": "^15.0.0",
    "prettier": "^3.0.0"
  }
}
```

---

## 6. معايير القبول

### المرحلة 1: إصلاحات حرجة
- [ ] جميع أخطاء TypeScript مُصلحة
- [ ] Error Boundaries متعددة مُضافة
- [ ] معالجة الأخطاء مُحسنة

### المرحلة 2: تحسينات الأداء
- [ ] React.memo مُطبق على جميع المكونات الثقيلة
- [ ] useMemo مُطبق على جميع الحسابات المعقدة
- [ ] useCallback مُطبق على جميع الدوال المعقدة

### المرحلة 3: اختبارات
- [ ] تغطية اختبارات 80% على الأقل
- [ ] جميع Store Actions مُختبرة
- [ ] جميع Utility Functions مُختبرة

### المرحلة 4: إمكانية الوصول
- [ ] جميع الأزرار تحتوي على ARIA labels
- [ ] skip links مُضافة
- [ ] keyboard navigation مُدعوم

### المرحلة 5: تحسينات الأمان
- [ ] البيانات الحساسة مُشفّرة
- [ ] المدخلات مُنقّاة
- [ ] CSP headers مُضافة

### المرحلة 6: تحسينات إضافية
- [ ] المكونات الكبيرة مُقسّمة
- [ ] virtualization مُطبقة على القوائم الطويلة
- [ ] التوثيق مُحدّث

---

## 7. خاتمة

هذه الخطة الشاملة تضمن إصلاح جميع المشاكل المكتشفة في تقرير التدقيق، مع التركيز على الجودة والأداء والأمان. التنفيذ التدريجي يضمن استقرار التطبيق أثناء الإصلاحات.

**تاريخ الخطة**: 2026-03-21
**الإصدار**: 1.0
**الحالة**: قيد التنفيذ
