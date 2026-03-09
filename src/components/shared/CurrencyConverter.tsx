import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftRight, RefreshCw } from 'lucide-react';
import { CURRENCIES, CurrencyCode } from '@/constants';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';

interface CurrencyConverterProps {
  compact?: boolean;
}

export function CurrencyConverter({ compact = false }: CurrencyConverterProps) {
  const [amount, setAmount] = useState<string>('1000');
  const [from, setFrom] = useState<CurrencyCode>('CNY');
  const [to, setTo] = useState<CurrencyCode>('USD');

  const numAmount = parseFloat(amount) || 0;
  const result = convertCurrency(numAmount, from, to);

  const swap = () => {
    setFrom(to);
    setTo(from);
  };

  if (compact) {
    return (
      <div className="bg-card rounded-xl border border-border p-4 shadow-card">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center">
            <RefreshCw className="w-4 h-4 text-secondary-foreground" />
          </div>
          <h4 className="font-bold text-sm">محول العملات</h4>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            className="w-20 px-2 py-1.5 text-sm bg-muted rounded-lg text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <select
            value={from}
            onChange={e => setFrom(e.target.value as CurrencyCode)}
            className="px-2 py-1.5 text-sm bg-muted rounded-lg focus:outline-none"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
          <button onClick={swap} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
            <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
          </button>
          <select
            value={to}
            onChange={e => setTo(e.target.value as CurrencyCode)}
            className="px-2 py-1.5 text-sm bg-muted rounded-lg focus:outline-none"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
        <div className="mt-3 p-2 bg-muted/50 rounded-lg text-center">
          <p className="text-lg font-bold">
            {getCurrencySymbol(to)}{formatNumber(result)}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-2xl border border-border p-5 shadow-card"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-secondary-foreground" />
        </div>
        <div>
          <h3 className="font-bold text-sm">محول العملات</h3>
          <p className="text-xs text-muted-foreground">تحويل بين يوان، دولار، ريال</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* From Section */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">من</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="0"
              className="flex-1 px-4 py-3 text-lg font-bold bg-muted rounded-xl text-center font-mono focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <select
              value={from}
              onChange={e => setFrom(e.target.value as CurrencyCode)}
              className="px-4 py-3 bg-muted rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[100px]"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={swap}
            className="p-2.5 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <ArrowLeftRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* To Section */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground">إلى</label>
          <div className="flex gap-2">
            <div className="flex-1 px-4 py-3 text-lg font-bold bg-accent/10 rounded-xl text-center font-mono text-accent">
              {getCurrencySymbol(to)}{formatNumber(result)}
            </div>
            <select
              value={to}
              onChange={e => setTo(e.target.value as CurrencyCode)}
              className="px-4 py-3 bg-muted rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-primary min-w-[100px]"
            >
              {CURRENCIES.map(c => (
                <option key={c.code} value={c.code}>{c.symbol} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Conversions */}
        <div className="pt-3 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">تحويلات سريعة</p>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <p className="text-muted-foreground">1 {from}</p>
              <p className="font-bold">{getCurrencySymbol(to)}{formatNumber(convertCurrency(1, from, to))}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <p className="text-muted-foreground">100 {from}</p>
              <p className="font-bold">{getCurrencySymbol(to)}{formatNumber(convertCurrency(100, from, to))}</p>
            </div>
            <div className="p-2 bg-muted/50 rounded-lg text-center">
              <p className="text-muted-foreground">1000 {from}</p>
              <p className="font-bold">{getCurrencySymbol(to)}{formatNumber(convertCurrency(1000, from, to))}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
