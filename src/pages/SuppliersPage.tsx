import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, Phone, MessageCircle, Building2, MapPin, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { PageHeader, StarRating, EmptyState, TextField, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { supplierSchema } from '@/lib/validations';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Supplier } from '@/types';

const emptyForm = { name: '', company_name: '', city: '', phone: '', wechat_or_whatsapp: '', product_category: '', notes: '' };

export default function SuppliersPage() {
  const { suppliers, addSupplier, updateSupplier, deleteSupplier } = useAppStore();
  const [open, setOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');

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

  const handleAdd = () => {
    const result = supplierSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach(issue => { fieldErrors[issue.path[0] as string] = issue.message; });
      setErrors(fieldErrors);
      return;
    }
    const d = result.data;
    
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
    
    setForm(emptyForm);
    setErrors({});
    setEditingSupplier(null);
    setOpen(false);
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingSupplier(supplier);
    setForm({
      name: supplier.name,
      company_name: supplier.company_name,
      city: supplier.city,
      phone: supplier.phone,
      wechat_or_whatsapp: supplier.wechat_or_whatsapp,
      product_category: supplier.product_category,
      notes: supplier.notes,
    });
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
    <div className="space-y-4">
      <PageHeader title="الموردين" subtitle={`${suppliers.length} مورد مسجل`}>
        <ExportButton data={suppliers} columns={exportColumns} filename="قائمة-الموردين" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setErrors({}); setEditingSupplier(null); setForm(emptyForm); } }}>
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
              <Button onClick={handleAdd} className="w-full gradient-secondary text-secondary-foreground font-bold">
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
        <EmptyState message={search || categoryFilter !== 'all' || cityFilter !== 'all' ? 'لا توجد نتائج مطابقة للبحث' : EMPTY_MESSAGES.suppliers} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((sup, i) => (
            <motion.div
              key={sup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border p-4 shadow-card glass-card-hover"
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
                <div className="flex items-center gap-1">
                  <StarRating rating={sup.rating} onRate={(r) => updateSupplier(sup.id, { rating: r })} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
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
