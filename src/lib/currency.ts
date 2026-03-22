/**
 * Currency Utilities - أدوات تحويل العملات
 * يقرأ أسعار الصرف من Store (قابلة للتعديل من الإعدادات)
 */

import { CurrencyCode } from '@/constants';
import { useAppStore } from '@/store/useAppStore';
import { CurrencyRates } from '@/types';

// أسعار الصرف الافتراضية (تُستخدم كقيم احتياطية)
const DEFAULT_RATES: Record<string, number> = {
  CNY_USD: 0.14,
  CNY_SAR: 0.52,
  USD_CNY: 7.15,
  USD_SAR: 3.75,
  SAR_CNY: 1.91,
  SAR_USD: 0.27,
};

/**
 * الحصول على أسعار الصرف الحالية من الـ Store
 */
function getCurrentRates(): Record<string, number> {
  try {
    const storeRates = useAppStore.getState().currencyRates;
    if (!storeRates || typeof storeRates !== 'object') {
      console.warn('Invalid currency rates from store, using defaults');
      return DEFAULT_RATES;
    }
    return storeRates as unknown as Record<string, number>;
  } catch (error) {
    console.error('Error getting currency rates from store:', error);
    return DEFAULT_RATES;
  }
}

/**
 * الحصول على سعر الصرف بين عملتين
 */
function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number | null {
  if (from === to) return 1;

  const rates = getCurrentRates();
  const key = `${from}_${to}`;
  const rate = rates[key];

  if (rate === undefined) {
    console.warn(`Exchange rate not found for ${from} to ${to}, checking defaults`);
    return DEFAULT_RATES[key] ?? null;
  }

  return rate;
}

/**
 * Error class للعملات
 */
export class CurrencyError extends Error {
  constructor(
    message: string,
    public code: 'INVALID_AMOUNT' | 'INVALID_CURRENCY' | 'RATE_NOT_FOUND'
  ) {
    super(message);
    this.name = 'CurrencyError';
  }
}

/**
 * تحويل مبلغ من عملة إلى أخرى
 * @param amount - المبلغ المراد تحويله
 * @param from - العملة المصدر (ISO 4217)
 * @param to - العملة الهدف (ISO 4217)
 * @returns المبلغ المحول
 * @throws CurrencyError إذا كانت العملة غير مدعومة أو المبلغ غير صالح
 * 
 * @example
 * const usdAmount = convertCurrency(100, 'CNY', 'USD');
 * // Returns: 14
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  // التحقق من صحة المبلغ
  if (typeof amount !== 'number' || isNaN(amount)) {
    throw new CurrencyError('المبلغ يجب أن يكون رقماً صالحاً', 'INVALID_AMOUNT');
  }

  // نفس العملة
  if (from === to) {
    return amount;
  }

  // التحقق من صحة العملات
  if (!isValidCurrency(from)) {
    throw new CurrencyError(`العملة المصدر غير صالحة: ${from}`, 'INVALID_CURRENCY');
  }

  if (!isValidCurrency(to)) {
    throw new CurrencyError(`العملة الهدف غير صالحة: ${to}`, 'INVALID_CURRENCY');
  }

  // الحصول على سعر الصرف
  const rate = getExchangeRate(from, to);

  if (rate === null) {
    throw new CurrencyError(
      `سعر الصرف غير متوفر للعملة: ${from} إلى ${to}`,
      'RATE_NOT_FOUND'
    );
  }

  // التحويل مع التقريب إلى منزلتين عشريتين
  return Math.round(amount * rate * 100) / 100;
}

/**
 * تنسيق المبلغ مع العملة
 * @param amount - المبلغ
 * @param currency - العملة
 * @returns المبلغ المُنسم
 * 
 * @example
 * formatCurrency(100, 'USD') // '$100'
 * formatCurrency(100, 'CNY') // '¥100'
 * formatCurrency(100, 'SAR') // 'ر.س100'
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = {
    CNY: '¥',
    USD: '$',
    SAR: 'ر.س'
  };

  const formatted = amount.toLocaleString(undefined, {
    maximumFractionDigits: 2
  });

  return `${symbols[currency]}${formatted}`;
}

/**
 * الحصول على رمز العملة
 * @param currency - العملة
 * @returns رمز العملة
 * 
 * @example
 * getCurrencySymbol('USD') // '$'
 * getCurrencySymbol('CNY') // '¥'
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = {
    CNY: '¥',
    USD: '$',
    SAR: 'ر.س'
  };

  return symbols[currency] ?? currency;
}

/**
 * التحقق من صحة العملة
 * @param currency - العملة المراد التحقق منها
 * @returns صحة العملة
 * 
 * @example
 * isValidCurrency('USD') // true
 * isValidCurrency('EUR') // false
 */
export function isValidCurrency(currency: string): currency is CurrencyCode {
  return ['CNY', 'USD', 'SAR'].includes(currency);
}
