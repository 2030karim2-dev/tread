import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { PageHeader, EmptyState, TextField, SelectField, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { expenseSchema } from '@/lib/validations';
import { Expense } from '@/types';
import { EXPENSE_CATEGORIES, CURRENCIES, EMPTY_MESSAGES } from '@/constants';
import { convertCurrency, getCurrencySymbol } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

const emptyForm = { category: 'hotel', amount: '', currency: 'CNY', date: '', notes: '' };

export default function ExpensesPage() {
  const { expenses, addExpense, updateExpense, deleteExpense } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currencyFilter, setCurrencyFilter] = useState('all');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const matchesSearch = search === '' || 
        expense.notes.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || expense.category === categoryFilter;
      const matchesCurrency = currencyFilter === 'all' || expense.currency === currencyFilter;
      return matchesSearch && matchesCategory && matchesCurrency;
    });
  }, [expenses, search, categoryFilter, currencyFilter]);

  const totalCNY = filteredExpenses.filter(e => e.currency === 'CNY').reduce((s, e) => s + e.amount, 0);
  const totalUSD = filteredExpenses.filter(e => e.currency === 'USD').reduce((s, e) => s + e.amount, 0) + convertCurrency(totalCNY, 'CNY', 'USD');
  const totalSAR = filteredExpenses.filter(e => e.currency === 'SAR').reduce((s, e) => s + e.amount, 0);

  const handleAdd = () => {
    const parsed = { ...form, amount: Number(form.amount) };
    const result = expenseSchema.safeParse(parsed);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }

    if (editingExpense) {
      updateExpense(editingExpense.id, result.data);
      toast({ title: 'تم التحديث', description: 'تم تحديث المصروف بنجاح' });
    } else {
      addExpense({ trip_id: '1', ...result.data } as Omit<Expense, 'id'>);
      toast({ title: 'تمت الإضافة', description: 'تم إضافة المصروف بنجاح' });
    }
    
    setForm(emptyForm);
    setErrors({});
    setEditingExpense(null);
    setOpen(false);
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setForm({
      category: expense.category,
      amount: String(expense.amount),
      currency: expense.currency,
      date: expense.date,
      notes: expense.notes,
    });
    setOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteExpense(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف المصروف بنجاح' });
      setDeleteId(null);
    }
  };

  const categoryOptions = Object.entries(EXPENSE_CATEGORIES).map(([k, v]) => ({ value: k, label: v.label }));
  const currencyOptions = CURRENCIES.map(c => ({ value: c.code, label: c.label }));

  const exportColumns = [
    { key: 'category', header: 'التصنيف' },
    { key: 'amount', header: 'المبلغ' },
    { key: 'currency', header: 'العملة' },
    { key: 'date', header: 'التاريخ' },
    { key: 'notes', header: 'ملاحظات' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="المصروفات" subtitle={`${expenses.length} مصروف`}>
        <ExportButton data={expenses} columns={exportColumns} filename="المصروفات" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setErrors({}); setEditingExpense(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2">
              <Plus className="w-4 h-4" /> مصروف جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                {editingExpense ? 'تعديل المصروف' : 'إضافة مصروف'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <SelectField label="التصنيف" value={form.category} onChange={v => setForm({ ...form, category: v })} options={categoryOptions} error={errors.category} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="المبلغ" value={form.amount} onChange={v => setForm({ ...form, amount: v })} type="number" error={errors.amount} />
                <SelectField label="العملة" value={form.currency} onChange={v => setForm({ ...form, currency: v })} options={currencyOptions} />
              </div>
              <TextField label="التاريخ" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" error={errors.date} />
              <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
              <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">
                {editingExpense ? 'تحديث' : 'حفظ'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search & Filters */}
      <SearchBar
        placeholder="ابحث في الملاحظات..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'category',
            label: 'التصنيف',
            options: categoryOptions,
            value: categoryFilter,
            onChange: setCategoryFilter,
          },
          {
            key: 'currency',
            label: 'العملة',
            options: currencyOptions,
            value: currencyFilter,
            onChange: setCurrencyFilter,
          },
        ]}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي باليوان</p>
          <p className="text-xl font-bold mt-1">¥{formatNumber(totalCNY)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي بالدولار</p>
          <p className="text-xl font-bold mt-1">${formatNumber(totalUSD)}</p>
        </div>
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <p className="text-xs text-muted-foreground">إجمالي بالريال</p>
          <p className="text-xl font-bold mt-1">ر.س{formatNumber(totalSAR)}</p>
        </div>
      </div>

      {filteredExpenses.length === 0 ? (
        <EmptyState message={search || categoryFilter !== 'all' || currencyFilter !== 'all' ? 'لا توجد نتائج مطابقة' : EMPTY_MESSAGES.expenses} />
      ) : (
        <div className="space-y-2">
          {filteredExpenses.map((exp, i) => {
            const cat = EXPENSE_CATEGORIES[exp.category];
            return (
              <motion.div 
                key={exp.id} 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                transition={{ delay: i * 0.03 }} 
                className="group bg-card rounded-xl border border-border p-4 shadow-sm flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${cat?.style || ''}`}>{cat?.label || exp.category}</span>
                  <div>
                    <p className="text-sm font-medium">{exp.notes || 'بدون ملاحظات'}</p>
                    <p className="text-xs text-muted-foreground">{exp.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-left">
                    <p className="font-bold text-sm">{getCurrencySymbol(exp.currency as 'CNY' | 'USD' | 'SAR')}{formatNumber(exp.amount)}</p>
                    {exp.currency === 'CNY' && (
                      <p className="text-xs text-muted-foreground">${formatNumber(convertCurrency(exp.amount, 'CNY', 'USD'))}</p>
                    )}
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(exp)}>
                        <Edit2 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(exp.id)}
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف المصروف"
        description="هل أنت متأكد من حذف هذا المصروف؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
