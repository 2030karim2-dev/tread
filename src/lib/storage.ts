// IndexedDB Storage Service for offline data persistence
// Provides a simple interface for storing app data locally

const DB_NAME = 'trade-navigator-db';
const DB_VERSION = 1;

interface DBSchema {
    trips: any[];
    suppliers: any[];
    products: any[];
    purchases: any[];
    sales: any[];
    expenses: any[];
    shipments: any[];
    quotations: any[];
    inventory: any[];
    notes: any[];
}

type StoreName = keyof DBSchema;

class IndexedDBService {
    private db: IDBDatabase | null = null;
    private initPromise: Promise<IDBDatabase> | null = null;

    async init(): Promise<IDBDatabase> {
        if (this.db) return this.db;
        if (this.initPromise) return this.initPromise;

        this.initPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => {
                console.error('Failed to open IndexedDB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result;

                // Create object stores if they don't exist
                const storeNames: StoreName[] = [
                    'trips', 'suppliers', 'products', 'purchases',
                    'sales', 'expenses', 'shipments', 'quotations',
                    'inventory', 'notes'
                ];

                storeNames.forEach(storeName => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        db.createObjectStore(storeName, { keyPath: 'id' });
                    }
                });
            };
        });

        return this.initPromise;
    }

    async getAll<T>(storeName: StoreName): Promise<T[]> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async get<T>(storeName: StoreName, id: string): Promise<T | undefined> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(id);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async put<T extends { id: string }>(storeName: StoreName, data: T): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async delete(storeName: StoreName, id: string): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async clear(storeName: StoreName): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async bulkPut<T extends { id: string }>(storeName: StoreName, data: T[]): Promise<void> {
        const db = await this.init();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(storeName, 'readwrite');
            const store = transaction.objectStore(storeName);

            data.forEach(item => store.put(item));

            transaction.oncomplete = () => resolve();
            transaction.onerror = () => reject(transaction.error);
        });
    }

    // Sync all data from memory store to IndexedDB
    async syncFromMemory<T extends { id: string }>(
        storeName: StoreName,
        data: T[]
    ): Promise<void> {
        await this.clear(storeName);
        if (data.length > 0) {
            await this.bulkPut(storeName, data);
        }
    }

    // Load all data from IndexedDB to memory
    async loadToMemory<T>(storeName: StoreName): Promise<T[]> {
        return this.getAll<T>(storeName);
    }
}

// Export singleton instance
export const storage = new IndexedDBService();

// Export type helper
export type { StoreName, DBSchema };
