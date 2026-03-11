# China Trade Assistant Pro - Architecture Plan

## 1. Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React Native (Expo) |
| Language | TypeScript |
| Styling | NativeWind (Tailwind CSS) |
| State Management | Zustand |
| Local Storage | SQLite + AsyncStorage |
| Maps | AMap (Gaode) + Baidu Maps |
| Cloud | Supabase (optional sync) |

---

## 2. Folder Structure

```
src/
├── app/                    # Expo Router screens
│   ├── (tabs)/            # Tab navigation
│   │   ├── index.tsx      # Dashboard
│   │   ├── trips.tsx      # Trips management
│   │   ├── products.tsx   # Products inventory
│   │   ├── notes.tsx      # Smart notes
│   │   └── settings.tsx   # App settings
│   ├── _layout.tsx        # Root layout
│   └── trip/
│       └── [id].tsx       # Trip details
│
├── components/             # Reusable UI components
│   ├── ui/               # Base UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── forms/            # Form components
│   │   ├── ProductForm.tsx
│   │   ├── TripForm.tsx
│   │   └── ...
│   └── common/           # Common components
│       ├── Header.tsx
│       ├── Loading.tsx
│       └── EmptyState.tsx
│
├── features/             # Feature modules
│   ├── trips/
│   │   ├── components/   # Trip-specific components
│   │   ├── screens/     # Trip screens
│   │   ├── hooks/       # Trip hooks
│   │   ├── store/       # Zustand store
│   │   └── types/       # TypeScript types
│   ├── products/
│   ├── suppliers/
│   ├── shipments/
│   ├── notes/
│   │   ├── components/  # NoteCard, VoiceRecorder
│   │   ├── hooks/       # useNotes, useVoiceRecorder
│   │   └── types/
│   └── phrases/         # Negotiation phrases
│
├── core/                 # Core utilities
│   ├── database/        # SQLite setup
│   │   ├── schema.ts    # Database schema
│   │   ├── migrations/  # DB migrations
│   │   └── queries/     # Query functions
│   ├── storage/         # AsyncStorage wrapper
│   ├── encryption/      # Data encryption
│   └── sync/           # Cloud sync logic
│
├── services/            # External services
│   ├── ai/             # AI services (STT, Translation)
│   ├── maps/           # Map providers
│   ├── location/       # GPS services
│   └── speech/         # TTS/STT services
│
├── hooks/              # Global hooks
│   ├── useDatabase.ts
│   ├── useOffline.ts
│   ├── useSync.ts
│   └── useAuth.ts
│
├── stores/             # Zustand stores
│   ├── appStore.ts
│   ├── tripsStore.ts
│   ├── productsStore.ts
│   └── syncStore.ts
│
├── types/             # Global types
│   ├── database.ts
│   ├── api.ts
│   └── common.ts
│
├── utils/             # Utility functions
│   ├── formatters.ts
│   ├── validators.ts
│   └── helpers.ts
│
└── constants/        # App constants
    ├── colors.ts
    ├── config.ts
    └── routes.ts
```

---

## 3. Data Layer

### 3.1 SQLite Schema

```typescript
// Database tables
const TABLES = {
  TRIPS: 'trips',
  PRODUCTS: 'products',
  SUPPLIERS: 'suppliers',
  SHIPMENTS: 'shipments',
  EXPENSES: 'expenses',
  NOTES: 'notes',
  PHRASES: 'phrases',
  SYNC_QUEUE: 'sync_queue',  // Offline changes to sync
};

// Example: Trips table
const TRIPS_SCHEMA = `
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT,
  start_date TEXT,
  end_date TEXT,
  status TEXT DEFAULT 'planned',
  notes TEXT,
  created_at TEXT,
  updated_at TEXT,
  synced_at TEXT,
  is_deleted INTEGER DEFAULT 0
`;
```

### 3.2 Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│                        UI Layer                             │
│  (Screens, Components)                                      │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Hooks Layer                              │
│  useTrips(), useProducts(), useNotes()                      │
│  - Read from Zustand                                        │
│  - Write to Zustand + SQLite                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  Zustand Store                              │
│  - In-memory cache                                          │
│  - Sync state                                               │
│  - Optimistic updates                                       │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  SQLite Database                            │
│  - Persistent local storage                                  │
│  - Full CRUD operations                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼ (when online)
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (Optional)                        │
│  - Cloud backup                                             │
│  - Cross-device sync                                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. Service Layer

### 4.1 AI Services

```typescript
// Speech-to-Text service
interface SpeechService {
  transcribe(audioUri: string): Promise<string>;
  startRecording(): Promise<void>;
  stopRecording(): Promise<string>;
}

// Translation service
interface TranslationService {
  translate(text: string, from: string, to: string): Promise<string>;
  translateBatch(texts: string[]): Promise<string[]>;
}

// Data extraction from notes
interface ExtractionService {
  extractProductInfo(text: string): Promise<ProductData>;
  extractSupplierInfo(text: string): Promise<SupplierData>;
  extractPrice(text: string): Promise<PriceData>;
}
```

### 4.2 Map Services

```typescript
// AMap (Gaode Maps) - Primary for China
interface MapService {
  getCurrentLocation(): Promise<Location>;
  searchPlaces(query: string): Promise<Place[]>;
  getDirections(from: Location, to: Location): Promise<Route>;
  showMarker(location: Location, title: string): void;
}
```

### 4.3 Location Services

```typescript
interface LocationService {
  getCurrentPosition(): Promise<Coords>;
  watchPosition(callback: (coords: Coords) => void): void;
  clearWatch(): void;
  getAddressFromCoords(coords: Coords): Promise<string>;
}
```

---

## 5. Offline-First Strategy

### 5.1 Core Principles

1. **Local First**: All data operations happen locally first
2. **Optimistic Updates**: UI updates immediately, sync in background
3. **Conflict Resolution**: Last-write-wins with timestamp
4. **Queue Management**: Pending changes queued for sync

### 5.2 Sync Queue

```typescript
interface SyncQueueItem {
  id: string;
  table: string;
  recordId: string;
  operation: 'create' | 'update' | 'delete';
  data: any;
  timestamp: number;
  retryCount: number;
  status: 'pending' | 'syncing' | 'failed';
}

// Sync process
async function syncData() {
  const pendingItems = await getPendingItems();
  
  for (const item of pendingItems) {
    try {
      await processSyncItem(item);
      await markAsSynced(item.id);
    } catch (error) {
      await incrementRetryCount(item.id);
      if (item.retryCount >= 3) {
        await markAsFailed(item.id);
      }
    }
  }
}
```

### 5.3 Network Detection

```typescript
// Offline detection
import { useNetInfo } from '@react-native-community/netinfo';

function useOffline() {
  const netInfo = useNetInfo();
  return !netInfo.isConnected;
}
```

---

## 6. Security

### 6.1 Data Encryption

```typescript
// Using expo-crypto for encryption
import * as Crypto from 'expo-crypto';

const encryptData = async (data: string, key: string): Promise<string> => {
  const digest = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    key
  );
  // Use digest as encryption key
  return encryptedData;
};
```

### 6.2 Biometric Auth

```typescript
// Using expo-local-authentication
import * as LocalAuthentication from 'expo-local-authentication';

const authenticate = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  
  if (hasHardware && isEnrolled) {
    return await LocalAuthentication.authenticateAsync();
  }
  return false;
};
```

---

## 7. Performance Optimization

### 7.1 Strategies

| Strategy | Implementation |
|----------|----------------|
| Lazy Loading | Dynamic imports for heavy screens |
| Image Optimization | expo-image for caching |
| Database Indexing | Index on frequently queried columns |
| Virtual Lists | FlatList with windowSize |
| Memoization | useMemo, useCallback |
| Background Sync | WorkManager for background tasks |

### 7.2 Database Optimization

```sql
-- Indexes for better query performance
CREATE INDEX idx_trips_status ON trips(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_notes_type ON notes(type);
CREATE INDEX idx_sync_status ON sync_queue(status);
```

### 7.3 Bundle Optimization

```typescript
// Dynamic imports for features
const TripsScreen = React.lazy(() => import('@/features/trips/screens/TripsScreen'));
const NotesScreen = React.lazy(() => import('@/features/notes/screens/NotesScreen'));
```

---

## 8. Implementation Priority

### Phase 1: Core (MVP)
1. SQLite setup + CRUD
2. Zustand stores
3. Basic UI components
4. Trips management
5. Products inventory
6. Offline detection

### Phase 2: Features
1. Smart notes (voice + text)
2. Supplier management
3. Shipment tracking
4. Expense tracking

### Phase 3: AI & Maps
1. Voice recording
2. Translation service
3. AMap integration
4. Location services

### Phase 4: Sync & Security
1. Supabase sync
2. Biometric auth
3. Data encryption
4. Performance tuning

---

## 9. Key Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "zustand": "^5.0.0",
    "expo-sqlite": "~15.0.0",
    "@react-native-async-storage/async-storage": "2.0.0",
    "nativewind": "^4.0.0",
    "expo-location": "~18.0.0",
    "expo-camera": "~16.0.0",
    "expo-av": "~15.0.0",
    "expo-speech": "~13.0.0",
    "@supabase/supabase-js": "^2.40.0",
    "expo-local-authentication": "~15.0.0",
    "@react-native-community/netinfo": "11.4.0"
  }
}
```

---

## 10. Summary

This architecture provides:
- ✅ Offline-first functionality
- ✅ Local SQLite database
- ✅ Zustand state management
- ✅ AI integration (STT, Translation)
- ✅ China-compatible maps (AMap, Baidu)
- ✅ Optional Supabase sync
- ✅ Biometric security
- ✅ Performance optimization
