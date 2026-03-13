import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Phone, MapPin, Edit2, Trash2, MoreVertical } from 'lucide-react';
import { PageHeader, EmptyState, TextField, SearchBar, ExportButton, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { customerSchema, CustomerFormData } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Customer } from '@/types';

const defaultValues: CustomerFormData = { name: '', company_name: '', city: '', phone: '', notes: '' };

export default function CustomersPage() {
  const customers = useAppStore(s => s.customers);
  const addCustomer = useAppStore(s => s.addCustomer);
  const updateCustomer = useAppStore(s => s.updateCustomer);
  const deleteCustomer = useAppStore(s => s.deleteCustomer);

  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');

  const { control, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  });

  useEffect(() => {
    if (editingCustomer) {
      reset({
        name: editingCustomer.name,
        company_name: editingCustomer.company_name,
        city: editingCustomer.city,
        phone: editingCustomer.phone,
        notes: editingCustomer.notes,
      });
    } else {
      reset(defaultValues);
    }
  }, [editingCustomer, reset]);

  const cities = useMemo(() => [...new Set(customers.map(c => c.city))], [customers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(customer => {
      const matchesSearch = search === '' ||
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.company_name.toLowerCase().includes(search.toLowerCase()) ||
        customer.city.toLowerCase().includes(search.toLowerCase());
      const matchesCity = cityFilter === 'all' || customer.city === cityFilter;
      return matchesSearch && matchesCity;
    });
  }, [customers, search, cityFilter]);

  const onSubmit = (d: CustomerFormData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name: d.name, company_name: d.company_name || '', city: d.city, phone: d.phone, notes: d.notes || ''
      });
      toast({ title: 'تم التحديث', description: 'تم تحديث العميل بنجاح' });
    } else {
      addCustomer({
        name: d.name, company_name: d.company_name || '', city: d.city, phone: d.phone, notes: d.notes || ''
      });
      toast({ title: 'تمت الإضافة', description: 'تم إضافة العميل بنجاح' });
    }
    setEditingCustomer(null);
    setOpen(false);
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteCustomer(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف العميل بنجاح' });
      setDeleteId(null);
    }
  };

  const exportColumns = [
    { key: 'name', header: 'الاسم' },
    { key: 'company_name', header: 'الشركة' },
    { key: 'city', header: 'المدينة' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'notes', header: 'ملاحظات' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="العملاء" subtitle={`${customers.length} عميل مسجل`}>
        <ExportButton data={customers} columns={exportColumns} filename="قائمة-العملاء" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { reset(defaultValues); setEditingCustomer(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> عميل جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-md">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                {editingCustomer ? 'تعديل العميل' : 'إضافة عميل جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <Controller name="name" control={control} render={({ field }) => (
                  <TextField label="اسم العميل" {...field} error={errors.name?.message || ''} />
                )} />
                <Controller name="company_name" control={control} render={({ field }) => (
                  <TextField label="اسم الشركة" {...field} error={errors.company_name?.message || ''} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="city" control={control} render={({ field }) => (
                  <TextField label="المدينة" {...field} error={errors.city?.message || ''} />
                )} />
                <Controller name="phone" control={control} render={({ field }) => (
                  <TextField label="الهاتف" {...field} error={errors.phone?.message || ''} />
                )} />
              </div>
              <Controller name="notes" control={control} render={({ field }) => (
                <TextField label="ملاحظات" {...field} error={errors.notes?.message || ''} />
              )} />
              <Button onClick={handleSubmit(onSubmit)} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editingCustomer ? 'تحديث العميل' : 'حفظ العميل'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <SearchBar
        placeholder="ابحث عن عميل..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'city',
            label: 'المدينة',
            options: cities.map(c => ({ value: c, label: c })),
            value: cityFilter,
            onChange: setCityFilter,
          },
        ]}
      />

      {filteredCustomers.length === 0 ? (
        <EmptyState message={search || cityFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا يوجد عملاء بعد. أضف أول عميل!'} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-xl border border-border p-4 shadow-card glass-card-hover"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center text-secondary-foreground font-bold text-sm">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{customer.name}</h4>
                    {customer.company_name && (
                      <p className="text-xs text-muted-foreground">{customer.company_name}</p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                      <MoreVertical className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(customer)}>
                      <Edit2 className="w-4 h-4 ml-2" /> تعديل
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(customer.id)}>
                      <Trash2 className="w-4 h-4 ml-2" /> حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span>{customer.city}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-secondary" />
                  <span dir="ltr">{customer.phone}</span>
                </div>
              </div>
              {customer.notes && (
                <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50 line-clamp-1">{customer.notes}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف العميل"
        description="هل أنت متأكد من حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
