import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Phone, Building2, MapPin, Edit2, Trash2, MoreVertical, LayoutGrid, Map } from 'lucide-react';
import { PageHeader, StarRating, EmptyState, TextField, SearchBar, ExportButton, ConfirmDialog, SupplierMapPlaceholder } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { supplierSchema, SupplierFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Supplier } from '@/types';

const defaultValues: SupplierFormData = {
  name: '', company_name: '', city: '', phone: '', wechat_or_whatsapp: '', product_category: '', notes: ''
};

export default function SuppliersPage() {
  const suppliers = useAppStore(s => s.suppliers);
  const addSupplier = useAppStore(s => s.addSupplier);
  const updateSupplier = useAppStore(s => s.updateSupplier);
  const deleteSupplier = useAppStore(s => s.deleteSupplier);


  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [view, setView] = useState<'grid' | 'map'>('grid');

  const { control, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });

  // Reset form when editing changes
  useEffect(() => {
    if (editingSupplier) {
      reset({
        name: editingSupplier.name,
        company_name: editingSupplier.company_name,
        city: editingSupplier.city,
        phone: editingSupplier.phone,
        wechat_or_whatsapp: editingSupplier.wechat_or_whatsapp,
        product_category: editingSupplier.product_category,
        notes: editingSupplier.notes,
      });
    } else {
      reset(defaultValues);
    }
  }, [editingSupplier, reset]);

  const categories = useMemo(() => [...new Set(suppliers.map(s => s.product_category))], [suppliers]);
  const cities = useMemo(() => [...new Set(suppliers.map(s => s.city))], [suppliers]);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(supplier => {
      const matchesSearch = search === '' ||
        supplier.name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.company_name.toLowerCase().includes(search.toLowerCase()) ||
        supplier.city.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || supplier.product_category === categoryFilter;
      const matchesCity = cityFilter === 'all' || supplier.city === cityFilter;
      return matchesSearch && matchesCategory && matchesCity;
    });
  }, [suppliers, search, categoryFilter, cityFilter]);

  const onSubmit = (d: SupplierFormData) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, {
        name: d.name, company_name: d.company_name, city: d.city, phone: d.phone,
        wechat_or_whatsapp: d.wechat_or_whatsapp || '', product_category: d.product_category, notes: d.notes || ''
      });
      toast({ title: 'تم التحديث', description: 'تم تحديث المورد بنجاح' });
    } else {
      addSupplier({
        name: d.name, company_name: d.company_name, city: d.city, phone: d.phone,
        wechat_or_whatsapp: d.wechat_or_whatsapp || '', product_category: d.product_category,
        notes: d.notes || '', rating: 0, trip_id: '1'
      });
      toast({ title: 'تمت الإضافة', description: 'تم إضافة المورد بنجاح' });
    }

    setEditingSupplier(null);
    setOpen(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteSupplier(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف المورد بنجاح' });
      setDeleteId(null);
    }
  };

  const exportColumns = [
    { key: 'name', header: 'اسم المورد' },
    { key: 'company_name', header: 'اسم الشركة' },
    { key: 'city', header: 'المدينة' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'wechat_or_whatsapp', header: 'WeChat/WhatsApp' },
    { key: 'product_category', header: 'التصنيف' },
    { key: 'rating', header: 'التقييم' },
    { key: 'notes', header: 'ملاحظات' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="الموردين" subtitle={`${suppliers.length} مورد مسجل`}>
        <div className="flex gap-2">
          <Button variant={view === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setView('grid')} className="w-10 px-0">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'map' ? 'default' : 'outline'} size="sm" onClick={() => setView('map')} className="w-10 px-0">
            <Map className="h-4 w-4" />
          </Button>
        </div>
        <ExportButton data={suppliers} columns={exportColumns} filename="قائمة-الموردين" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { reset(defaultValues); setEditingSupplier(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> مورد جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                {editingSupplier ? 'تعديل المورد' : 'إضافة مورد جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <Controller name="name" control={control} render={({ field }) => (
                  <TextField label="اسم المورد" {...field} error={errors.name?.message} />
                )} />
                <Controller name="company_name" control={control} render={({ field }) => (
                  <TextField label="اسم الشركة" {...field} error={errors.company_name?.message} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="city" control={control} render={({ field }) => (
                  <TextField label="المدينة" {...field} error={errors.city?.message} />
                )} />
                <Controller name="product_category" control={control} render={({ field }) => (
                  <TextField label="التصنيف" {...field} error={errors.product_category?.message} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="phone" control={control} render={({ field }) => (
                  <TextField label="الهاتف" {...field} error={errors.phone?.message} />
                )} />
                <Controller name="wechat_or_whatsapp" control={control} render={({ field }) => (
                  <TextField label="WeChat / WhatsApp" {...field} error={errors.wechat_or_whatsapp?.message} />
                )} />
              </div>
              <Controller name="notes" control={control} render={({ field }) => (
                <TextField label="ملاحظات" {...field} error={errors.notes?.message} />
              )} />
              <Button onClick={handleSubmit(onSubmit)} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editingSupplier ? 'تحديث المورد' : 'حفظ المورد'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {/* Search & Filters */}
      <SearchBar
        placeholder="ابحث عن مورد..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'category',
            label: 'التصنيف',
            options: categories.map(c => ({ value: c, label: c })),
            value: categoryFilter,
            onChange: setCategoryFilter,
          },
          {
            key: 'city',
            label: 'المدينة',
            options: cities.map(c => ({ value: c, label: c })),
            value: cityFilter,
            onChange: setCityFilter,
          },
        ]}
      />

      {filteredSuppliers.length === 0 ? (
        <EmptyState message={search || categoryFilter !== 'all' || cityFilter !== 'all' ? 'لا توجد نتائج مطابقة للبحث' : 'لا يوجد موردين بعد. أضف أول مورد!'} />
      ) : view === 'map' ? (
        <SupplierMapPlaceholder />
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((sup, i) => (
            <motion.div
              key={sup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-xl border border-border p-2 sm:p-4 shadow-card glass-card-hover"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-1.5 sm:gap-3">
                  <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl gradient-primary flex items-center justify-center text-[10px] sm:text-sm font-bold text-primary-foreground shrink-0">
                    {sup.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-[11px] sm:text-sm truncate">{sup.name}</h4>
                    <p className="text-[9px] sm:text-xs text-muted-foreground flex items-center gap-1 truncate">
                      <Building2 className="w-2.5 h-2.5 shrink-0" />
                      <span className="truncate">{sup.company_name}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5">
                  <div className="hidden sm:block">
                    <StarRating rating={sup.rating} onRate={(r) => updateSupplier(sup.id, { rating: r })} />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                        <MoreVertical className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(sup)}>
                        <Edit2 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="text-destructive focus:text-destructive"
                        onClick={() => setDeleteId(sup.id)}
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex flex-wrap gap-1 mb-2">
                <span className="inline-flex items-center bg-secondary/10 text-secondary rounded-md px-1.5 py-0.5 text-[9px] font-semibold max-w-full truncate">
                  {sup.product_category}
                </span>
                <span className="inline-flex items-center gap-1 bg-muted text-muted-foreground rounded-md px-1.5 py-0.5 text-[9px] max-w-full truncate">
                  <MapPin className="w-2.5 h-2.5 shrink-0" />
                  <span className="truncate">{sup.city}</span>
                </span>
              </div>

              <div className="space-y-1 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5 p-1.5 rounded-lg bg-muted/50">
                  <Phone className="w-3 h-3 text-primary shrink-0" />
                  <span className="font-mono text-foreground truncate">{sup.phone}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف المورد"
        description="هل أنت متأكد من حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
