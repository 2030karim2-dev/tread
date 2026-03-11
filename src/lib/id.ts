/**
 * ID Generator Utilities - أدوات توليد المعرفات الفريدة
 * يحل محل generateId() الضعيف في helpers.ts
 */

import { nanoid } from 'nanoid';

/**
 * طول المعرفات الافتراضي
 */
const DEFAULT_LENGTH = 12;

/**
 * توليد معرف فريد باستخدام nanoid
 * @param length - طول المعرف (افتراضي 12)
 * @returns معرف فريد
 * 
 * @example
 * generateId() // 'V1StGXR8_Z'
 * generateId(8) // 'V1StGXR8'
 */
export function generateId(length: number = DEFAULT_LENGTH): string {
    return nanoid(length);
}

/**
 * توليد معرف مع بادئة
 * @param prefix - البادئة (مثل 'trip', 'supplier')
 * @returns معرف مع بادئة
 * 
 * @example
 * generatePrefixedId('trip') // 'trip_V1StGXR8'
 * generatePrefixedId('supplier') // 'supplier_abc123'
 */
export function generatePrefixedId(prefix: string): string {
    return `${prefix}_${nanoid(8)}`;
}

/**
 * توليد معرف رقمي فقط (للأرقام التسلسلية)
 * @param length - طول المعرف
 * @returns معرف رقمي
 * 
 * @example
 * generateNumericId(6) // '123456'
 */
export function generateNumericId(length: number = 6): string {
    let result = '';
    for (let i = 0; i < length; i++) {
        result += Math.floor(Math.random() * 10).toString();
    }
    return result;
}

/**
 * توليد معرف من timestamp
 * @returns معرف يعتمد على الوقت
 * 
 * @example
 * generateTimestampId() // '1700000000000abc123'
 */
export function generateTimestampId(): string {
    return Date.now().toString(36) + nanoid(6);
}

/**
 * التحقق من صحة المعرف
 * @param id - المعرف المراد التحقق منه
 * @returns صحة المعرف
 * 
 * @example
 * isValidId('V1StGXR8_Z') // true
 * isValidId('') // false
 */
export function isValidId(id: string): boolean {
    return typeof id === 'string' && id.length > 0 && /^[a-zA-Z0-9_-]+$/.test(id);
}
