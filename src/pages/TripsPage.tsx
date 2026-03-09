import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, MapPin, Calendar, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { PageHeader, StatusBadge, EmptyState, TextField, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { tripSchema } from '@/lib/validations';
import { EMPTY_MESSAGES, STATUS_LABELS } from '@/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Trip } from '@/types';

const emptyForm = { name: '', country: 'الصين', city: '', start_date: '', end_date: '', notes: '' };

export default function TripsPage() {
  const { trips, addTrip, updateTrip, deleteTrip } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredTrips = useMemo(() => {
    return trips.filter(trip => {
      const matchesSearch = search === '' || 
        trip.name.toLowerCase().includes(search.toLowerCase()) ||
        trip.city.toLowerCase().includes(search.toLowerCase()) ||
        trip.country.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === 'all' || trip.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [trips, search, statusFilter]);

  const handleAdd = () => {
    const result = tripSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    const d = result.data;
    
    if (editingTrip) {
      updateTrip(editingTrip.id, { name: d.name, country: d.country, city: d.city, start_date: d.start_date, end_date: d.end_date, notes: d.notes || '' });
      toast({ title: 'تم التحديث', description: 'تم تحديث الرحلة بنجاح' });
    } else {
      addTrip({ name: d.name, country: d.country, city: d.city, start_date: d.start_date, end_date: d.end_date, notes: d.notes || '', status: 'planning' });
      toast({ title: 'تمت الإضافة', description: 'تم إضافة الرحلة بنجاح' });
    }
    
    setForm(emptyForm);
    setErrors({});
    setEditingTrip(null);
    setOpen(false);
  };

  const handleEdit = (trip: Trip) => {
    setEditingTrip(trip);
    setForm({
      name: trip.name,
      country: trip.country,
      city: trip.city,
      start_date: trip.start_date,
      end_date: trip.end_date,
      notes: trip.notes,
    });
    setOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteTrip(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف الرحلة بنجاح' });
      setDeleteId(null);
    }
  };

  const exportColumns = [
    { key: 'name', header: 'اسم الرحلة' },
    { key: 'country', header: 'البلد' },
    { key: 'city', header: 'المدينة' },
    { key: 'start_date', header: 'تاريخ البداية' },
    { key: 'end_date', header: 'تاريخ النهاية' },
    { key: 'status', header: 'الحالة' },
    { key: 'notes', header: 'ملاحظات' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="رحلات الشراء" subtitle={`${trips.length} رحلة مسجلة`}>
        <ExportButton data={trips} columns={exportColumns} filename="رحلات-الشراء" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setErrors({}); setEditingTrip(null); setForm(emptyForm); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> رحلة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                {editingTrip ? 'تعديل الرحلة' : 'إضافة رحلة جديدة'}
              </DialogTitle>
            </DialogHeader>
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
              <Button onClick={handleAdd} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editingTrip ? 'تحديث الرحلة' : 'حفظ الرحلة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search & Filters */}
      <SearchBar
        placeholder="ابحث عن رحلة..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'status',
            label: 'الحالة',
            options: [
              { value: 'planning', label: STATUS_LABELS.planning },
              { value: 'active', label: STATUS_LABELS.active },
              { value: 'completed', label: STATUS_LABELS.completed },
            ],
            value: statusFilter,
            onChange: setStatusFilter,
          },
        ]}
      />

      {filteredTrips.length === 0 ? (
        <EmptyState message={search || statusFilter !== 'all' ? 'لا توجد نتائج مطابقة للبحث' : EMPTY_MESSAGES.trips} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTrips.map((trip, i) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-bold text-sm">{trip.name}</h4>
                <div className="flex items-center gap-1">
                  <StatusBadge status={trip.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(trip)}>
                        <Edit2 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(trip.id)}
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
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

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الرحلة"
        description="هل أنت متأكد من حذف هذه الرحلة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
