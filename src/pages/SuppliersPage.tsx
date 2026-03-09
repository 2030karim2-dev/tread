import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, MessageCircle } from 'lucide-react';
import { PageHeader, StarRating, EmptyState, TextField } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { supplierSchema } from '@/lib/validations';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const emptyForm = { name: '', company_name: '', city: '', phone: '', wechat_or_whatsapp: '', product_category: '', notes: '' };

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const result = supplierSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    addSupplier({ ...result.data, rating: 0, trip_id: '1' });
    setForm(emptyForm);
    setErrors({});
    setOpen(false);
    toast({ title: 'تمت الإضافة', description: 'تم إضافة المورد بنجاح' });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="الموردين">
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> مورد جديد</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>إضافة مورد جديد</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <TextField label="اسم المورد" value={form.name} onChange={v => setForm({ ...form, name: v })} error={errors.name} />
                <TextField label="اسم الشركة" value={form.company_name} onChange={v => setForm({ ...form, company_name: v })} error={errors.company_name} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="المدينة" value={form.city} onChange={v => setForm({ ...form, city: v })} error={errors.city} />
                <TextField label="التصنيف" value={form.product_category} onChange={v => setForm({ ...form, product_category: v })} error={errors.product_category} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="الهاتف" value={form.phone} onChange={v => setForm({ ...form, phone: v })} error={errors.phone} />
                <TextField label="WeChat / WhatsApp" value={form.wechat_or_whatsapp} onChange={v => setForm({ ...form, wechat_or_whatsapp: v })} />
              </div>
              <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
              <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">حفظ المورد</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {suppliers.length === 0 ? (
        <EmptyState message={EMPTY_MESSAGES.suppliers} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((sup, i) => (
            <motion.div key={sup.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-bold text-sm">{sup.name}</h4>
                  <p className="text-xs text-muted-foreground">{sup.company_name}</p>
                </div>
                <StarRating rating={sup.rating} onRate={(r) => updateSupplier(sup.id, { rating: r })} />
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground mt-3">
                <p className="inline-flex items-center gap-1.5 bg-muted rounded-full px-2 py-0.5 font-medium">{sup.product_category}</p>
                <div className="flex items-center gap-2"><Phone className="w-3 h-3" />{sup.phone}</div>
                <div className="flex items-center gap-2"><MessageCircle className="w-3 h-3" />{sup.wechat_or_whatsapp}</div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
