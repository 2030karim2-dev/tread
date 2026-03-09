import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, MessageCircle } from 'lucide-react';
import { PageHeader, StarRating, EmptyState } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', company_name: '', city: '', phone: '', wechat_or_whatsapp: '', product_category: '', notes: '' });

  const handleAdd = () => {
    addSupplier({ ...form, rating: 0, trip_id: '1' });
    setForm({ name: '', company_name: '', city: '', phone: '', wechat_or_whatsapp: '', product_category: '', notes: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="الموردين">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> مورد جديد</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>إضافة مورد جديد</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <div><Label>اسم المورد</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>اسم الشركة</Label><Input value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>المدينة</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></div>
                <div><Label>التصنيف</Label><Input value={form.product_category} onChange={e => setForm({ ...form, product_category: e.target.value })} /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>الهاتف</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>WeChat / WhatsApp</Label><Input value={form.wechat_or_whatsapp} onChange={e => setForm({ ...form, wechat_or_whatsapp: e.target.value })} /></div>
              </div>
              <div><Label>ملاحظات</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
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
