import { CurrencyCode } from '@/constants';

// Fixed exchange rates (will be replaced with live API later)
const RATES: Record<string, number> = {
  CNY_USD: 0.14,
  CNY_SAR: 0.52,
  USD_CNY: 7.15,
  USD_SAR: 3.75,
  SAR_CNY: 1.91,
  SAR_USD: 0.27,
};

export function convertCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const key = `${from}_${to}`;
  const rate = RATES[key];
  if (!rate) return amount;
  return amount * rate;
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = { CNY: '¥', USD: '$', SAR: 'ر.س' };
  const formatted = amount.toLocaleString(undefined, { maximumFractionDigits: 2 });
  return `${symbols[currency]}${formatted}`;
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  const symbols: Record<CurrencyCode, string> = { CNY: '¥', USD: '$', SAR: 'ر.س' };
  return symbols[currency];
}
