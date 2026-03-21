/**
 * Storage Service - خدمة التخزين
 * يستخدم IndexedDB عبر idb-keyval لتجنب تجميد الواجهة مع البيانات الكبيرة
 */

import { generateId } from '@/lib/id';
import { get, set as idbSet, del } from 'idb-keyval';

export interface StorageOptions {
    prefix?: string;
    storage?: Storage;
}

/**
 * دالة بسيطة للتشفير
 */
export const encrypt = (data: string): string => {
    try {
        return btoa(encodeURIComponent(data));
    } catch {
        return data;
    }
};

/**
 * دالة بسيطة لفك التشفير
 */
export const decrypt = (data: string): string => {
    try {
        return decodeURIComponent(atob(data));
    } catch {
        return data;
    }
};

/**
 * مخزن مخصص لـ Zustand يعتمد على IndexedDB (غير متزامن، لا يجمّد الواجهة)
 * يقوم بالهجرة التلقائية من localStorage عند أول تشغيل
 */
export const zustandStorage = {
    getItem: async (name: string): Promise<string | null> => {
        // حاول الحصول من IndexedDB أولاً
        const idbVal = await get<string>(name);
        if (idbVal !== undefined) return idbVal;

        // هجرة من localStorage إن وُجد
        const legacyStr = localStorage.getItem(name);
        if (legacyStr) {
            let val = legacyStr;
            try {
                if (!legacyStr.startsWith('{"') && !legacyStr.startsWith('[')) {
                    val = decrypt(legacyStr);
                }
            } catch { /* ignore */ }
            // انقل البيانات إلى IndexedDB وامسح localStorage
            await idbSet(name, val);
            localStorage.removeItem(name);
            return val;
        }
        return null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
        await idbSet(name, value);
    },
    removeItem: async (name: string): Promise<void> => {
        await del(name);
    },
};

/**
 * خدمة التخزين الموحدة
 */
class StorageService {
    private prefix: string;
    private storage: Storage;

    constructor(options: StorageOptions = {}) {
        this.prefix = options.prefix ?? 'app_';
        this.storage = options.storage ?? localStorage;
    }

    /**
     * تعيين قيمة
     */
    set<T>(key: string, value: T): void {
        try {
            const serialized = JSON.stringify(value);
            this.storage.setItem(this.getKey(key), encrypt(serialized));
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    /**
     * الحصول على قيمة
     */
    get<T>(key: string, defaultValue?: T): T | undefined {
        try {
            const item = this.storage.getItem(this.getKey(key));
            if (item === null) {
                return defaultValue;
            }
            let decrypted = item;
            try {
                if (!item.startsWith('{') && !item.startsWith('[')) {
                    decrypted = decrypt(item);
                }
            } catch {
                decrypted = item;
            }
            return JSON.parse(decrypted) as T;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return defaultValue;
        }
    }

    /**
     * حذف قيمة
     */
    remove(key: string): void {
        try {
            this.storage.removeItem(this.getKey(key));
        } catch (error) {
            console.error('Error removing from storage:', error);
        }
    }

    /**
     * مسح كل القيم
     */
    clear(): void {
        try {
            const keys = this.keys();
            keys.forEach((key) => this.storage.removeItem(key));
        } catch (error) {
            console.error('Error clearing storage:', error);
        }
    }

    /**
     * التحقق من وجود مفتاح
     */
    has(key: string): boolean {
        return this.storage.getItem(this.getKey(key)) !== null;
    }

    /**
     * الحصول على كل المفاتيح
     */
    keys(): string[] {
        const keys: string[] = [];
        for (let i = 0; i < this.storage.length; i++) {
            const key = this.storage.key(i);
            if (key && key.startsWith(this.prefix)) {
                keys.push(key);
            }
        }
        return keys;
    }

    /**
     * الحصول على حجم التخزين
     */
    size(): number {
        let size = 0;
        this.keys().forEach((key) => {
            const item = this.storage.getItem(key);
            if (item) {
                size += item.length;
            }
        });
        return size;
    }

    /**
     * إضافة مفتاح مع معرف فريد
     */
    push<T>(key: string, item: T): string {
        const id = generateId();
        const items = this.get<T[]>(key) ?? [];
        items.push(item);
        this.set(key, items);
        return id;
    }

    /**
     * حذف عنصر بالمعرف
     */
    pull<T>(key: string, id: string): boolean {
        const items = this.get<T[]>(key) ?? [];
        const index = items.findIndex((item: unknown) => (item as { id?: string }).id === id);
        if (index !== -1) {
            items.splice(index, 1);
            this.set(key, items);
            return true;
        }
        return false;
    }

    /**
     * الحصول على المفتاح مع البادئة
     */
    private getKey(key: string): string {
        return `${this.prefix}${key}`;
    }
}

// التصدير الافتراضي
export const storage = new StorageService({
    prefix: 'autoparts_',
});

export default storage;
