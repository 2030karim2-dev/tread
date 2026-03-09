import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, MessageCircle, Building2, MapPin } from 'lucide-react';
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
    const d = result.data;
    addSupplier({ name: d.name, company_name: d.company_name, city: d.city, phone: d.phone, wechat_or_whatsapp: d.wechat_or_whatsapp || '', product_category: d.product_category, notes: d.notes || '', rating: 0, trip_id: '1' });
    setForm(emptyForm);
    setErrors({});
    setOpen(false);
    toast({ title: 'تمت الإضافة', description: 'تم إضافة المورد بنجاح' });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="الموردين" subtitle={`${suppliers.length} مورد مسجل`}>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> مورد جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle className="font-extrabold">إضافة مورد جديد</DialogTitle></DialogHeader>
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
              <Button onClick={handleAdd} className="w-full gradient-secondary text-secondary-foreground font-bold">حفظ المورد</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {suppliers.length === 0 ? (
        <EmptyState message={EMPTY_MESSAGES.suppliers} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suppliers.map((sup, i) => (
            <motion.div
              key={sup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                    {sup.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{sup.name}</h4>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {sup.company_name}
                    </p>
                  </div>
                </div>
                <StarRating rating={sup.rating} onRate={(r) => updateSupplier(sup.id, { rating: r })} />
              </div>
              
              <div className="flex flex-wrap gap-1.5 mb-3">
                <span className="inline-flex items-center gap-1 bg-secondary/10 text-secondary rounded-lg px-2 py-0.5 text-[11px] font-semibold">
                  {sup.product_category}
                </span>
                <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground rounded-lg px-2 py-0.5 text-[11px]">
                  <MapPin className="w-3 h-3" />
                  {sup.city}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                  <Phone className="w-3.5 h-3.5 text-primary" />
                  <span className="font-mono text-foreground">{sup.phone}</span>
                </div>
                {sup.wechat_or_whatsapp && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <MessageCircle className="w-3.5 h-3.5 text-accent" />
                    <span className="font-mono text-foreground">{sup.wechat_or_whatsapp}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
