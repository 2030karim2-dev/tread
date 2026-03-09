import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Expense } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCIES, EMPTY_MESSAGES } from '@/constants';
import { convertCurrency, formatCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ExpensesPage() {
  const { expenses, addExpense } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ category: 'hotel' as Expense['category'], amount: '', currency: 'CNY', date: '', notes: '' });

  const totalCNY = expenses.filter(e => e.currency === 'CNY').reduce((s, e) => s + e.amount, 0);
  const totalUSD = convertCurrency(totalCNY, 'CNY', 'USD');

  const handleAdd = () => {
    addExpense({ trip_id: '1', ...form, amount: Number(form.amount) } as Omit<Expense, 'id'>);
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="المصروفات">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> مصروف جديد</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>إضافة مصروف</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div>
                <Label>التصنيف</Label>
                <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Expense['category'] })}>
                  {Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>المبلغ</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
                <div>
                  <Label>العملة</Label>
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}>
                    {CURRENCIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
              </div>
              <div><Label>التاريخ</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div><Label>ملاحظات</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">حفظ</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي باليوان</p>
          <p className="text-xl font-bold mt-1">¥{formatNumber(totalCNY)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي بالدولار</p>
          <p className="text-xl font-bold mt-1">${formatNumber(totalUSD)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <EmptyState message={EMPTY_MESSAGES.expenses} />
      ) : (
        <div className="space-y-2">
          {expenses.map((exp, i) => {
            const cat = EXPENSE_CATEGORIES[exp.category];
            return (
              <motion.div key={exp.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${cat?.style || ''}`}>{cat?.label || exp.category}</span>
                  <div>
                    <p className="text-sm font-medium">{exp.notes}</p>
                    <p className="text-xs text-muted-foreground">{exp.date}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{getCurrencySymbol(exp.currency as 'CNY' | 'USD' | 'SAR')}{formatNumber(exp.amount)}</p>
                  {exp.currency === 'CNY' && (
                    <p className="text-xs text-muted-foreground">${formatNumber(convertCurrency(exp.amount, 'CNY', 'USD'))}</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
