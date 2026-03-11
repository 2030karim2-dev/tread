# خطة إعادة هيكلة الملفات الكبيرة

## نظرة عامة

هذه الخطة تهدف لتقسيم الملفات الكبيرة في المشروع وتسهيل صيانتها عبر فصل المكونات والمنطق.

---

## الملفات الكبيرة (أكثر من 500 سطر)

| الملف | الحجم | الإجراء المقترح |
|-------|-------|-----------------|
| `src/pages/Dashboard.tsx` | ~400 سطر | تقسيم إلى مكونات |
| `src/pages/NotesPage.tsx` | ~450 سطر | تقسيم إلى مكونات |
| `src/components/ui/sidebar.tsx` | ~600 سطر | تقسيم إلى مكونات |
| `src/lib/validation.ts` | ~200 سطر | تقسيم الدوال |
| `src/hooks/useCommonHooks.ts` | ~200 سطر | فصل كل hook |

---

## المرحلة 1: تقسيم Dashboard.tsx

### الهدف: تحويل ملف واحد إلى هيكل معياري

```
src/features/dashboard/
├── components/
│   ├── DashboardHero.tsx       ✅ موجود
│   ├── StatsCards.tsx          ✅ موجود
│   ├── RevenueChart.tsx        (جديد - مخطط الإيرادات)
│   ├── InventoryChart.tsx      (جديد - مخطط المخزون)
│   ├── ExpensesChart.tsx       (جديد - مخطط المصروفات)
│   └── QuickStats.tsx          (جديد - إحصائيات سريعة)
├── hooks/
│   └── useDashboardStats.ts    ✅ موجود
└── index.ts                    (جديد - export مركزي)
```

### المكونات المطلوب استخراجها:

1. **DashboardHero** - قسم الترحيب
2. **FinancialStats** - بطاقات الإحصائيات المالية
3. **InventoryChart** - مخطط المخزون (BarChart)
4. **ExpensesPieChart** - مخطط المصروفات (PieChart)
5. **RecentTrips** - آخر الرحلات
6. **QuickActions** - الإجراءات السريعة

---

## المرحلة 2: تقسيم NotesPage.tsx

### الهدف: فصل واجهة المستخدم عن منطق الأعمال

```
src/features/notes/
├── components/
│   ├── NotesHeader.tsx         (جديد - عنوان الصفحة + بحث)
│   ├── NotesStats.tsx          (جديد - إحصائيات الملاحظات)
│   ├── NoteCard.tsx            (جديد - بطاقة ملاحظة)
│   ├── NoteDialog.tsx         (جديد - dialog إضافة/تعديل)
│   ├── NoteFilters.tsx        (جديد - فلترة الملاحظات)
│   ├── VoiceRecorder.tsx      (جديد - تسجيل صوتي)
│   └── LocationPicker.tsx    (جديد - اختيار الموقع)
├── hooks/
│   ├── useNotes.ts             ✅ موجود
│   ├── useVoiceRecorder.ts    (جديد - فصل عن useNotes)
│   └── useLocation.ts         (جديد - فصل عن useNotes)
├── types/
│   └── index.ts                ✅ موجود
└── index.ts                   (جديد - export مركزي)
```

### الدوال المطلوب استخراجها من NotesPage:

- `formatTime` → `useVoiceRecorder`
- `handleSave` → `useNotes.addNote`
- `handleDelete` → `useNotes.deleteNote`
- `handleGetLocation` → `useLocation.getLocation`
- `reset` → `useNotes` أو `useForm`

---

## المرحلة 3: تقسيم sidebar.tsx

### الهدف: تقسيم مكون الـ sidebar الضخم

```
src/components/layout/
├── sidebar/
│   ├── Sidebar.tsx             (الملف الرئيسي)
│   ├── SidebarHeader.tsx      (الشعار + عنوان)
│   ├── SidebarNav.tsx         ✅ موجود
│   ├── SidebarFooter.tsx      (إعدادات المستخدم)
│   ├── SidebarGroup.tsx       (مجموعة عناصر)
│   └── SidebarItem.tsx        (عنصر واحد)
└── AppLayout.tsx               (التخطيط الرئيسي)
```

### الملاحظات:
- الـ sidebar الحالي (~600 سطر) يحتوي على منطق معقد
- يمكن تقسيمه إلى مكونات أصغر
- الـ navigation موجود بالفعل في `SidebarNav.tsx`

---

## المرحلة 4: تقسيم useCommonHooks.ts

### الهدف: فصل كل hook في ملف منفصل

```
src/hooks/
├── use-mobile.tsx              ✅ موجود (595 سطر)
├── use-toast.ts                ✅ موجود
├── useKeyboardShortcuts.ts     ✅ موجود
├── useOffline.ts              ✅ موجود
├── useScreenSize.ts           ✅ موجود
└── (جديد) useCommon.ts        → يمكن حذفه أو تقسيمه
```

### الإجراء:
- `useCommonHooks.ts` (~200 سطر) يمكن فصله إلى:
  - `useLocalStorage.ts` (تخزين محلي)
  - `useDebounce.ts` (تأخير)
  - `useClipboard.ts` (الحافظة)

---

## المرحلة 5: تقسيم lib/validation.ts

### الهدف: فصل أنواع التحقق

```
src/lib/validation/
├── index.ts                    (export مركزي)
├── product.ts                  (تحقق المنتجات)
├── supplier.ts                 (تحقق الموردين)
├── expense.ts                  (تحقق المصروفات)
├── trip.ts                     (تحقق الرحلات)
└── common.ts                   (تحقق مشترك)
```

---

## المرحلة 6: إنشاء index.ts للمجلدات

### أ) features/notes/index.ts
```typescript
export { default as NotesPage } from '@/pages/NotesPage';
export * from './hooks/useNotes';
export * from './types';
```

### ب) features/phrases/index.ts
```typescript
export { default as PhrasesPage } from '@/pages/PhrasesPage';
export * from './hooks/usePhrases';
export * from './types';
```

### ج) features/dashboard/index.ts (موجود)
```typescript
export { default as Dashboard } from '@/pages/Dashboard';
export * from './components/DashboardHero';
export * from './hooks/useDashboardStats';
```

---

## تنفيذ الخطة

### الأولوية:

1. **الأولوية العالية** (تأثير كبير على الكود):
   - NotesPage.tsx - الأكثر تعقيداً
   - Dashboard.tsx - كثير التغيير

2. **الأولوية المتوسطة**:
   - sidebar.tsx - معقد لكن مستقر
   - validation.ts - كثير الاستخدام

3. **الأولوية المنخفضة**:
   - useCommonHooks.ts - يمكن تحسينه تدريجياً

---

## ملاحظات هامة

### أثناء التقسيم:
1. **الحفاظ على المسارات** - استخدام alias `@/` 
2. **عدم كسر الـ imports** - تحديث المسارات تدريجياً
3. **اختبار كل جزء** - بعد كل تقسيم
4. **_commits صغيرة** - لتسهيل التراجع

### أفضل الممارسات:
- كل ملفcomponent/hook/page < 200 سطر
- فصل الـ UI عن الـ Business Logic
- استخدام barrel exports (`index.ts`)
-命名的一致性 (تسميات متسقة)

---

##Herramientas المطلوبة

- VSCode with TypeScript support
- Refactor: "Move to folder" 
- Search & Replace للتحديثات الجماعية
