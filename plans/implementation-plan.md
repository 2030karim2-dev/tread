# خطة التنفيذ التفصيلية - China Trade Assistant Pro

## نظرة عامة

هذا المستند يحدد خطة التنفيذ المرحلية الشاملة لبناء الميزات والخدمات المفقودة في التطبيق.

---

## الملخص التنفيذي

| المرحلة | المدة | الميزات | الأولوية |
|---------|-------|---------|----------|
| Phase 1 | أسبوعين | PWA + Offline + Service Workers | 🔴 Critical |
| Phase 2 | أسبوع | Negotiation Phrasebook | 🔴 Critical |
| Phase 3 | أسبوعين | Smart Notes (Voice + Images) | 🔴 Critical |
| Phase 4 | أسبوعين | Supplier Map | 🔶 Medium |
| Phase 5 | أسبوع | Accommodation Finder | 🔶 Medium |
| Phase 6 | أسبوع | UX Improvements | 🔶 Medium |

---

## المرحلة 1: البنية التحتية (PWA + Offline)

### الهدف
تمكين التطبيق من العمل 90% بدون إنترنت

### الملفات المطلوبة
```
src/
├── public/
│   ├── manifest.json          # PWA Manifest
│   ├── sw.js                  # Service Worker
│   ├── icons/                 # PWA Icons
│   └── offline.html           # Offline fallback
├── src/
│   ├── libs/
│   │   └── storage.ts         # IndexedDB wrapper
│   ├── hooks/
│   │   └── useOffline.ts      # Offline detection hook
│   └── registers/
│       └── serviceWorker.ts  # SW registration
```

### التبعيات
- vite-plugin-pwa
- idb (IndexedDB wrapper)

### المخرجات
- [ ] manifest.json للتثبيت كـ PWA
- [ ] Service Worker للتخزين المؤقت
- [ ] دعم IndexedDB للبيانات المحلية
- [ ] detection للتعامل مع حالة عدم الاتصال

### الكود المطلوب

#### 1. PWA Manifest (public/manifest.json)
```json
{
  "name": "China Trade Assistant Pro",
  "short_name": "TradePro",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#2563eb",
  "icons": [...]
}
```

#### 2. Service Worker (public/sw.js)
- Cache static assets
- Cache API responses
- Offline fallback page

#### 3. IndexedDB Service (src/lib/storage.ts)
```typescript
// OpenDB, put, get, getAll, delete
```

---

## المرحلة 2: دليل المفاوضة (Negotiation Phrasebook)

### الهدف
توفير أداة للمفاوضة مع الموردين الصينيين

### الملفات المطلوبة
```
src/
├── features/
│   └── phrases/
│       ├── data/
│       │   └── phrases.ts     # قاعدة البيانات
│       ├── components/
│       │   ├── PhrasesList.tsx
│       │   ├── Phrase.tsx
│       │   └──Card PhrasePlayer.tsx
│       ├── hooks/
│       │   └── usePhrases.ts
│       └── index.ts
```

### البيانات المطلوبة (50 عبارة أساسية)
| الفئة | عدد العبارات |
|-------|-------------|
| التحية والترحيب | 5 |
| المساومة والأسعار | 10 |
| الكميات والطلبات | 8 |
| الدفع والشحن | 10 |
| الجودة والضمان | 7 |
| الإجراءات والخاتمة | 10 |

### структура البيانات
```typescript
interface Phrase {
  id: string;
  category: string;
  arabic: string;
  chinese: string;
  pinyin: string;
  audio_url?: string;
  isFavorite: boolean;
}
```

### المكونات
1. **PhrasesPage** - الصفحة الرئيسية
2. **CategoryFilter** - تصفية حسب الفئة
3. **SearchBar** - بحث في العبارات
4. **PhraseCard** - عرض عبارة واحدة
5. **PhrasePlayer** - تشغيل الصوت (TTS)

### التبعيات
- Web Speech API (Text-to-Speech)
- react-speech-recognition (اختياري)

---

## المرحلة 3: الملاحظات الذكية (Smart Notes)

### الهدف
تمكين التجار من حفظ المعلومات بسرعة أثناء التنقل في الأسواق

### الملفات المطلوبة
```
src/
├── features/
│   └── notes/
│       ├── components/
│       │   ├── NotesList.tsx
│       │   ├── NoteCard.tsx
│       │   ├── NoteEditor.tsx
│       │   └── VoiceRecorder.tsx
│       ├── hooks/
│       │   └── useNotes.ts
│       ├── types/
│       │   └── note.ts
│       └── index.ts
```

### الميزات
1. **ملاحظات نصية** - تحسين现有的
2. **ملاحظات صوتية** - Web Speech API
3. **صور المنتجات** - Image upload
4. **حفظ الموقع** - Geolocation API
5. **ربط برحلة/مورد** - Trip/Supplier linking

### струкطة البيانات
```typescript
interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'voice' | 'image';
  audio_url?: string;
  image_url?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  trip_id?: string;
  supplier_id?: string;
  created_at: string;
  updated_at: string;
}
```

---

## المرحلة 4: خريطة الموردين (Supplier Map)

### الهدف
عرض الموردين على خريطة تفاعلية

### الملفات المطلوبة
```
src/
├── features/
│   └── map/
│       ├── components/
│       │   ├── SupplierMap.tsx
│       │   ├── MapControls.tsx
│       │   └── SupplierMarker.tsx
│       ├── hooks/
│       │   └── useSupplierMap.ts
│       └── index.ts
```

### الميزات
1. **عرض الخريطة** - Mapbox/Google Maps
2. ** الموردين
Markers** - مواقع3. **Filters** - تصفية حسب التقييم/الفئة
4. **Clustering** - تجميع المتقاربين
5. **Directions** - الاتجاهات

### التبعيات
- react-map-gl (Mapbox) أو @react-google-maps/api
- يتطلب API Key

---

## المرحلة 5: البحث عن السكن (Accommodation Finder)

### الهدف
مساعدة التجار في العثور على سكن رخيص قرب الأسواق

### الملفات المطلوبة
```
src/
├── features/
│   └── accommodation/
│       ├── components/
│       │   ├── AccommodationList.tsx
│       │   ├── AccommodationCard.tsx
│       │   ├── Filters.tsx
│       │   └── MapView.tsx
│       ├── hooks/
│       │   └── useAccommodation.ts
│       ├── types/
│       │   └── accommodation.ts
│       └── index.ts
```

### الميزات
1. **قائمة السكن** -民宿/فنادق
2. **تصفية السعر** - Range slider
3. **تصفية المسافة** - من الأسواق
4. **التقييمات** - من التجار العرب
5. **الخريطة** - عرض الموقع

### structة البيانات
```typescript
interface Accommodation {
  id: string;
  name: string;
  type: 'hotel' | 'apartment' | 'hostel';
  price_per_night: number;
  currency: 'CNY' | 'USD' | 'SAR';
  distance_to_market: number; // km
  rating: number;
  reviews: Review[];
  amenities: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  contact_phone: string;
  wechat?: string;
}
```

---

## المرحلة 6: تحسينات UX

### الهدف
تحسين تجربة المستخدم في الأسواق المزدحمة

### التحسينات
1. **وضع السوق (Market Mode)**
   - أزرار أكبر 50%
   - ألوان عالية التباين
   - نصوص أكبر

2. **اختصارات لوحة المفاتيح**
   - R: تسجيل ملاحظة
   - S: بحث سريع
   - N: إضافة مورد جديد
   - E: إضافة مصروف

3. **إيماءات**
   - Swipe للحذف
   - Pull to refresh

---

## الترتيب الأمثل للتنفيذ

### الأسبوع 1-2: البنية التحتية
```
Day 1-2:   Setup PWA config in vite.config.ts
Day 3-4:   Create manifest.json
Day 5-6:   Implement Service Worker
Day 7-10:  Create IndexedDB storage service
Day 11-14: Integrate with existing store
```

### الأسبوع 3: دليل المفاوضة
```
Day 1-2:   Create phrases data (50 phrases)
Day 3-4:   Build PhrasesPage + components
Day 5:     Implement TTS playback
Day 6-7:   Add search and categories
```

### الأسبوع 4-5: الملاحظات الذكية
```
Day 1-2:   Create Note types and store
Day 3-4:   Build NotesPage
Day 5-6:   Implement voice recording
Day 7-8:   Add image upload
Day 9-10:  Implement location saving
```

### الأسبوع 6-7: خريطة الموردين
```
Day 1-2:   Setup Mapbox/Google Maps
Day 3-4:   Create map components
Day 5-6:   Add supplier markers
Day 7-8:   Implement filters
```

### الأسبوع 8: البحث عن السكن
```
Day 1-2:   Create accommodation types
Day 3-4:   Build accommodation page
Day 5:     Add filters
Day 6-7:   Add mock data for demo
```

### الأسبوع 9-10: تحسينات UX
```
Day 1-2:   Create Market Mode toggle
Day 3-4:   Implement keyboard shortcuts
Day 5:     Add touch gestures
Day 6-7:   Testing and polish
```

---

## التبعيات بين المراحل

```
Phase 1 (PWA)
    │
    ├──► Phase 2 (Phrases)
    │         │
    │         └──► Phase 3 (Notes)
    │                   │
    │                   └──► Phase 4 (Map)
    │                             │
    │                             └──► Phase 5 (Accommodation)
    │                                       │
    │                                       └──► Phase 6 (UX)
    │
    └────► Can run in parallel:
           - Phase 2
           - Phase 3
           - Phase 6
```

---

## ملاحظات التنفيذ

### متطلبات API Keys
| الخدمة | الاستخدام | التكلفة |
|--------|-----------|---------|
| Mapbox | خريطة الموردين | مجاني (50k/mo) |
| Google Maps | بديل للخريطة | مدفوع |
| Supabase/Firebase | backend | مجاني (بدءاً) |

### اعتبارات الأداء
- Lazy load للخرائط
- Compress الصور
- Cache البيانات محلياً
- Debounce عمليات البحث

### الاختبارات المطلوبة
- PWA: Lighthouse audit
- Offline: Network throttling test
- Voice: Multiple browsers test
- Map: Different screen sizes

---

## الخلاصة

| المرحلة | الجاهزية | الأسبوع |
|---------|---------|--------|
| Phase 1: PWA | ⚪ Whitepaper | 1-2 |
| Phase 2: Phrases | ⚪ Whitepaper | 3 |
| Phase 3: Notes | ⚪ Whitepaper | 4-5 |
| Phase 4: Map | ⚪ Whitepaper | 6-7 |
| Phase 5: Accommodation | ⚪ Whitepaper | 8 |
| Phase 6: UX | ⚪ Whitepaper | 9-10 |

**المدة الإجمالية: 10 أسابيع**

---

*تاريخ الإنشاء: 2026-03-11*
*آخر تحديث: 2026-03-11*
