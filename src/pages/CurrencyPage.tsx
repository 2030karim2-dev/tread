import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader, CurrencyConverter } from '@/components/shared';
import { CURRENCIES, CurrencyCode } from '@/constants';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';

// Conversion matrix table
const allPairs = [
  { from: 'CNY' as CurrencyCode, to: 'USD' as CurrencyCode },
  { from: 'CNY' as CurrencyCode, to: 'SAR' as CurrencyCode },
  { from: 'USD' as CurrencyCode, to: 'CNY' as CurrencyCode },
  { from: 'USD' as CurrencyCode, to: 'SAR' as CurrencyCode },
  { from: 'SAR' as CurrencyCode, to: 'CNY' as CurrencyCode },
  { from: 'SAR' as CurrencyCode, to: 'USD' as CurrencyCode },
];

const commonAmounts = [1, 10, 50, 100, 500, 1000, 5000, 10000];

export default function CurrencyPage() {
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyCode>('CNY');

  const symbol = getCurrencySymbol(selectedCurrency);

  return (
    <div className="space-y-5">
      <PageHeader title="محول العملات" subtitle="تحويل بين اليوان الصيني والدولار الأمريكي والريال السعودي" />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Main Converter */}
        <CurrencyConverter />

        {/* Rate Cards */}
        <div className="grid grid-cols-2 gap-3">
          {allPairs.map(({ from, to }) => {
            const rate = convertCurrency(1, from, to);
            return (
              <motion.div
                key={`${from}-${to}`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-xl border border-border p-4 shadow-card"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold">{from}</span>
                    <span className="text-muted-foreground text-xs">→</span>
                    <span className="text-sm font-bold">{to}</span>
                  </div>
                </div>
                <p className="text-lg font-bold text-primary">
                  {getCurrencySymbol(to)}{formatNumber(rate)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  1 {from} = {getCurrencySymbol(to)}{formatNumber(rate)} {to}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="bg-card rounded-2xl border border-border shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-bold text-sm">جدول التحويل السريع</h3>
          <div className="flex gap-1">
            {CURRENCIES.map(c => (
              <button
                key={c.code}
                onClick={() => setSelectedCurrency(c.code as CurrencyCode)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  selectedCurrency === c.code
                    ? 'gradient-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {c.code}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-right px-4 py-3 font-bold">{selectedCurrency}</th>
                {CURRENCIES.filter(c => c.code !== selectedCurrency).map(c => (
                  <th key={c.code} className="text-center px-4 py-3 font-bold">{c.symbol} {c.code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {commonAmounts.map((amount, i) => (
                <tr key={amount} className={`border-b border-border/50 ${i % 2 === 0 ? 'bg-muted/20' : ''}`}>
                  <td className="px-4 py-3 font-bold font-mono">
                    {symbol}{formatNumber(amount)}
                  </td>
                  {CURRENCIES.filter(c => c.code !== selectedCurrency).map(c => (
                    <td key={c.code} className="px-4 py-3 text-center font-mono">
                      {getCurrencySymbol(c.code as CurrencyCode)}
                      {formatNumber(convertCurrency(amount, selectedCurrency, c.code as CurrencyCode))}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-3 border-t border-border bg-muted/20">
          <p className="text-xs text-muted-foreground text-center">
            ⚠️ الأسعار تقريبية وثابتة — سيتم الاتصال بسعر الصرف اللحظي في الإصدار القادم
          </p>
        </div>
      </div>
    </div>
  );
}
