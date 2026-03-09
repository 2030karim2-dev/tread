import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { PageHeader, StatusBadge, EmptyState, TextField } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { tripSchema } from '@/lib/validations';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';

const emptyForm = { name: '', country: 'الصين', city: '', start_date: '', end_date: '', notes: '' };

export default function TripsPage() {
  const { trips, addTrip } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleAdd = () => {
    const result = tripSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    const d = result.data;
    addTrip({ name: d.name, country: d.country, city: d.city, start_date: d.start_date, end_date: d.end_date, notes: d.notes || '', status: 'planning' });
    setForm(emptyForm);
    setErrors({});
    setOpen(false);
    toast({ title: 'تمت الإضافة', description: 'تم إضافة الرحلة بنجاح' });
  };

  return (
    <div className="space-y-4">
      <PageHeader title="رحلات الشراء" subtitle={`${trips.length} رحلة مسجلة`}>
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setErrors({}); }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> رحلة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle className="font-extrabold">إضافة رحلة جديدة</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <TextField label="اسم الرحلة" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="رحلة قوانغتشو..." error={errors.name} />
              <div className="grid grid-cols-2 gap-3">
                <TextField label="البلد" value={form.country} onChange={v => setForm({ ...form, country: v })} error={errors.country} />
                <TextField label="المدينة" value={form.city} onChange={v => setForm({ ...form, city: v })} placeholder="قوانغتشو" error={errors.city} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <TextField label="تاريخ البداية" value={form.start_date} onChange={v => setForm({ ...form, start_date: v })} type="date" error={errors.start_date} />
                <TextField label="تاريخ النهاية" value={form.end_date} onChange={v => setForm({ ...form, end_date: v })} type="date" error={errors.end_date} />
              </div>
              <TextField label="ملاحظات" value={form.notes} onChange={v => setForm({ ...form, notes: v })} />
              <Button onClick={handleAdd} className="w-full gradient-secondary text-secondary-foreground font-bold">حفظ الرحلة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {trips.length === 0 ? (
        <EmptyState message={EMPTY_MESSAGES.trips} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-sm">{trip.name}</h4>
                <StatusBadge status={trip.status} />
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="font-medium">{trip.city}، {trip.country}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Calendar className="w-3.5 h-3.5 text-secondary" />
                  </div>
                  <span>{trip.start_date} → {trip.end_date}</span>
                </div>
              </div>
              {trip.notes && (
                <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border/50 line-clamp-2">{trip.notes}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
