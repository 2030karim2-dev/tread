import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { PageHeader, EmptyState, TextField, SelectField } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { expenseSchema } from '@/lib/validations';
import { Expense } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCIES, EMPTY_MESSAGES } from '@/constants';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const emptyForm = { category: 'hotel', amount: '', currency: 'CNY', date: '', notes: '' };

export default function ExpensesPage() {
  const { expenses, addExpense } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalCNY = expenses.filter(e => e.currency === 'CNY').reduce((s, e) => s + e.amount, 0);
  const totalUSD = convertCurrency(totalCNY, 'CNY', 'USD');

  const handleAdd = () => {
    const parsed = { ...form, amount: Number(form.amount) };
    const result = expenseSchema.safeParse(parsed);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    addExpense({ trip_id: '1', ...result.data } as Omit<Expense, 'id'>);
    setForm(emptyForm);
    setErrors({});
    setOpen(false);
    toast({ title: 'تمت الإضافة', description: 'تم إضافة المصروف بنجاح' });
  };

  const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => ({ value: k, label: v.label }));
  const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: c.label }));

  return (
    <div className="space-y-4">
      <PageHeader title="المصروفات">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> مصروف جديد</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>إضافة مصروف</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <SelectField label="التصنيف" value={form.category} onChange={v => setForm({ ...form, category: v })} options={categoryOptions} error={errors.category} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="المبلغ" value={form.amount} onChange={v => setForm({ ...form, amount: v })} type="number" error={errors.amount} />
                <SelectField label="العملة" value={form.currency} onChange={v => setForm({ ...form, currency: v })} options={currencyOptions} />
              </div>
              <TextField label="التاريخ" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" error={errors.date} />
              <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
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
