import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar } from 'lucide-react';
import { PageHeader, StatusBadge, EmptyState } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Trip } from '@/types';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TripsPage() {
  const { trips, addTrip } = useAppStore();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', country: 'الصين', city: '', start_date: '', end_date: '', notes: '' });

  const handleAdd = () => {
    addTrip({ ...form, status: 'planning' });
    setForm({ name: '', country: 'الصين', city: '', start_date: '', end_date: '', notes: '' });
    setOpen(false);
  };

  return (
    <div className="space-y-4">
      <PageHeader title="رحلات الشراء">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground gap-2"><Plus className="w-4 h-4" /> رحلة جديدة</Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader><DialogTitle>إضافة رحلة جديدة</DialogTitle></DialogHeader>
            <div className="space-y-3 mt-2">
              <div><Label>اسم الرحلة</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="رحلة قوانغتشو..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>البلد</Label><Input value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} /></div>
                <div><Label>المدينة</Label><Input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="قوانغتشو" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>تاريخ البداية</Label><Input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} /></div>
                <div><Label>تاريخ النهاية</Label><Input type="date" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} /></div>
              </div>
              <div><Label>ملاحظات</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
              <Button onClick={handleAdd} className="w-full gradient-primary text-primary-foreground">حفظ الرحلة</Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {trips.length === 0 ? (
        <EmptyState message={EMPTY_MESSAGES.trips} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip, i) => (
            <motion.div key={trip.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-card rounded-xl border border-border p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-sm">{trip.name}</h4>
                <StatusBadge status={trip.status} />
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /><span>{trip.city}، {trip.country}</span></div>
                <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5" /><span>{trip.start_date} → {trip.end_date}</span></div>
              </div>
              {trip.notes && <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border">{trip.notes}</p>}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
