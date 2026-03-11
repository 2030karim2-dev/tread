/**
 * Currency Utilities - أدوات تحويل العملات
 * يحتوي على أسعار صرف ثابتة (يجب استبدالها بـ API حقيقي)
 */

import { CurrencyCode } from '@/constants';

// أسعار الصرف الثابتة (يجب استبدالها بـ API حقيقي في الإنتاج)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const RATES: Record<string, number> = {
  CNY_USD: 0.14,
  CNY_SAR: 0.52,
  USD_CNY: 7.15,
  USD_SAR: 3.75,
  SAR_CNY: 1.91,
  SAR_USD: 0.27,
};

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
 * الحصول على سعر الصرف بين عملتين
 * @param from - العملة المصدر
 * @param to - العملة الهدف
 * @returns سعر الصرف أو null إذا لم يُعثر عليه
 */
function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number | null {
  if (from === to) return 1;

  const key = `${from}_${to}`;
  const rate = RATES[key];

  return rate ?? null;
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

  if (amount < 0) {
    throw new CurrencyError('المبلغ يجب أن يكون أكبر من صفر', 'INVALID_AMOUNT');
  }

  // نفس العملة
  if (from === to) {
    return amount;
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
