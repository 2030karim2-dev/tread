import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Phone, Building2, MapPin, Edit2, Trash2, MoreVertical, LayoutGrid, Map, Factory, Clock, Wallet, TrendingDown, Users, Globe, FileText, Table, MessageCircle, Navigation, Facebook, Map as ChinaMapIcon } from 'lucide-react';
import { PageHeader, StarRating, EmptyState, TextField, SelectField, SearchBar, ExportButton, ConfirmDialog, SupplierMapPlaceholder, LedgerModal, StatCard, VoucherModal, EditableTable } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { useLedgers } from '@/hooks/useLedgers';
import { convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { supplierSchema, SupplierFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Supplier } from '@/types';

const defaultValues: SupplierFormData = {
  name: '', company_name: '', city: '', phone: '', 
  whatsapp: '', wechat: '', website: '', facebook: '', 
  google_maps: '', china_maps: '',
  product_category: '', notes: '', factory_grade: 'A', moq: '', lead_time_days: 15, trip_id: '1'
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
  const [view, setView] = useState<'grid' | 'table' | 'map'>('grid');
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [activeParty, setActiveParty] = useState<{id: string, name: string, type: 'customer' | 'supplier'} | null>(null);

  const { getAllBalances } = useLedgers();
  const balances = useMemo(() => getAllBalances(), [getAllBalances]);

  const totals = useMemo(() => {
    let totalPayables = 0;
    suppliers.forEach(s => {
        const curBalances = balances[s.id] || {};
        Object.entries(curBalances).forEach(([cur, amt]) => {
            if (typeof amt !== 'number' || isNaN(amt)) return;
            try {
                totalPayables += convertCurrency(amt, cur as any, 'USD');
            } catch (e) {}
        });
    });
    return { 
        totalPayables,
        highGrade: suppliers.filter(s => s.factory_grade === 'A').length
    };
  }, [suppliers, balances]);

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
        whatsapp: editingSupplier.whatsapp || '',
        wechat: editingSupplier.wechat || '',
        website: editingSupplier.website || '',
        facebook: editingSupplier.facebook || '',
        google_maps: editingSupplier.google_maps || '',
        china_maps: editingSupplier.china_maps || '',
        product_category: editingSupplier.product_category,
        notes: editingSupplier.notes,
        factory_grade: editingSupplier.factory_grade || 'A',
        moq: editingSupplier.moq || '',
        lead_time_days: editingSupplier.lead_time_days || 15,
        trip_id: editingSupplier.trip_id || '1',
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
    }).map(s => ({
        ...s,
        balanceUSD: Object.entries(balances[s.id] || {}).reduce((acc, [cur, amt]) => {
            if (typeof amt !== 'number' || isNaN(amt)) return acc;
            try { return acc + convertCurrency(amt, cur as any, 'USD'); } catch(e) { return acc; }
        }, 0)
    }));
  }, [suppliers, search, categoryFilter, cityFilter, balances]);

  const onSubmit = useCallback((d: SupplierFormData) => {
    if (editingSupplier) {
      updateSupplier(editingSupplier.id, { ...editingSupplier, ...d });
      toast({ title: 'تم التحديث', description: 'تم تحديث المورد بنجاح' });
    } else {
      addSupplier({ ...d, rating: 0 });
      toast({ title: 'تمت الإضافة', description: 'تم إضافة المورد بنجاح' });
    }

    setEditingSupplier(null);
    setOpen(false);
  }, [editingSupplier, updateSupplier, addSupplier]);

  const handleEdit = useCallback((supplier: Supplier) => {
    setEditingSupplier(supplier);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteSupplier(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف المورد بنجاح' });
      setDeleteId(null);
    }
  }, [deleteId, deleteSupplier]);

  const exportColumns = useMemo(() => [
    { key: 'name', header: 'اسم المورد' },
    { key: 'company_name', header: 'اسم الشركة' },
    { key: 'factory_grade', header: 'تصنيف الجودة' },
    { key: 'moq', header: 'أدنى كمية للطلب (MOQ)' },
    { key: 'lead_time_days', header: 'مدة التصنيع (يوم)' },
    { key: 'city', header: 'المدينة' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'wechat_or_whatsapp', header: 'WeChat/WhatsApp' },
    { key: 'product_category', header: 'التصنيف' },
    { key: 'rating', header: 'التقييم' },
    { key: 'notes', header: 'ملاحظات' },
  ], []);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="الموردين" subtitle={`${suppliers.length} مورد مسجل`}>
        <div className="flex gap-1.5 bg-muted/50 p-1 rounded-xl">
          <Button variant={view === 'grid' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('grid')} className="w-9 h-9 p-0 rounded-lg">
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={view === 'table' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('table')} className="w-9 h-9 p-0 rounded-lg">
            <Table className="h-4 w-4" />
          </Button>
          <Button variant={view === 'map' ? 'secondary' : 'ghost'} size="sm" onClick={() => setView('map')} className="w-9 h-9 p-0 rounded-lg">
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
          <Button 
            variant="outline" 
            onClick={() => setVoucherOpen(true)}
            className="border-secondary text-secondary hover:bg-secondary/10 gap-2 font-bold"
          >
            <Wallet className="w-4 h-4" /> سند دفع
          </Button>
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
                <Controller name="whatsapp" control={control} render={({ field }) => (
                  <TextField label="واتساب" {...field} error={errors.whatsapp?.message} />
                )} />
                <Controller name="wechat" control={control} render={({ field }) => (
                  <TextField label="ويشات" {...field} error={errors.wechat?.message} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="website" control={control} render={({ field }) => (
                  <TextField label="رابط الموقع" {...field} error={errors.website?.message} />
                )} />
                <Controller name="facebook" control={control} render={({ field }) => (
                  <TextField label="فيس بوك" {...field} error={errors.facebook?.message} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="google_maps" control={control} render={({ field }) => (
                  <TextField label="خرائط جوجل" {...field} error={errors.google_maps?.message} />
                )} />
                <Controller name="china_maps" control={control} render={({ field }) => (
                  <TextField label="خرائط الصين" {...field} error={errors.china_maps?.message} />
                )} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Controller name="factory_grade" control={control} render={({ field }) => (
                  <SelectField label="تصنيف الجودة" options={[{value: 'A', label: 'مصنع أصلي (A)'}, {value: 'B', label: 'جودة متوسطة (B)'}, {value: 'C', label: 'وسيط تجاري (C)'}]} {...field} error={errors.factory_grade?.message} />
                )} />
                <Controller name="moq" control={control} render={({ field }) => (
                  <TextField label="أدنى كمية (MOQ)" placeholder="مثال: 500 حبة" {...field} error={errors.moq?.message} />
                )} />
                <Controller name="lead_time_days" control={control} render={({ field: { value, onChange, ...fieldProps } }) => (
                  <TextField label="مدة التصنيع (يوم)" type="number" value={value ? value.toString() : ''} onChange={(val) => onChange(val ? Number(val) : 0)} {...fieldProps} error={errors.lead_time_days?.message} />
                )} />
              </div>
              <Controller name="notes" control={control} render={({ field }) => (
                <TextField label="ملاحظات وتفاصيل التفاوض" {...field} error={errors.notes?.message} />
              )} />
              <Button onClick={handleSubmit(onSubmit)} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editingSupplier ? 'تحديث المورد' : 'حفظ المورد'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
            title="إجمالي الموردين" 
            value={suppliers.length} 
            icon={Users} 
            variant="default"
        />
        <StatCard 
            title="مستحقات الموردين (علينا)" 
            value={`$${formatNumber(Math.abs(totals.totalPayables))}`} 
            icon={TrendingDown} 
            variant="accent"
        />
        <StatCard 
            title="مصانع فئة ممتاز (A)" 
            value={totals.highGrade} 
            icon={Globe} 
            variant="primary"
        />
      </div>

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
      ) : view === 'table' ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl glass-card">
            <EditableTable 
                data={filteredSuppliers}
                columns={[
                    { key: 'name', header: 'المورد', minWidth: '150px' },
                    { key: 'company_name', header: 'الشركة', minWidth: '150px' },
                    { key: 'factory_grade', header: 'الفئة', minWidth: '80px', align: 'center',
                        render: (row) => (
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded shadow-sm ${row.factory_grade === 'A' ? 'bg-emerald-500 text-white' : row.factory_grade === 'B' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                                {row.factory_grade}
                            </span>
                        )
                    },
                    { 
                        key: 'balanceUSD', header: 'الرصيد', minWidth: '120px', align: 'center',
                        render: (row) => (
                            <span className={`font-black ${row.balanceUSD < 0 ? 'text-emerald-500' : row.balanceUSD > 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                                {row.balanceUSD === 0 ? '--' : `$${formatNumber(Math.abs(row.balanceUSD))}`}
                                <span className="text-[10px] mr-1 opacity-70">{row.balanceUSD < 0 ? '(لنا)' : row.balanceUSD > 0 ? '(مستحق)' : ''}</span>
                            </span>
                        )
                    },
                    { key: 'city', header: 'المدينة', minWidth: '100px' },
                    {
                        key: 'social', header: 'التواصل والخرائط', minWidth: '220px', align: 'center',
                        render: (row) => (
                            <div className="flex items-center justify-center gap-2">
                                {row.whatsapp && (
                                    <a href={`https://wa.me/${row.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="text-emerald-500 hover:scale-110 transition-transform"><MessageCircle className="w-4 h-4" /></a>
                                )}
                                {row.wechat && (
                                    <span className="text-green-600 cursor-help" title={`WeChat ID: ${row.wechat}`}><MessageCircle className="w-4 h-4" /></span>
                                )}
                                {row.website && (
                                    <a href={row.website} target="_blank" rel="noreferrer" className="text-blue-500 hover:scale-110 transition-transform"><Globe className="w-4 h-4" /></a>
                                )}
                                {row.facebook && (
                                    <a href={row.facebook} target="_blank" rel="noreferrer" className="text-indigo-600 hover:scale-110 transition-transform"><Facebook className="w-4 h-4" /></a>
                                )}
                                {row.google_maps && (
                                    <a href={row.google_maps} target="_blank" rel="noreferrer" className="text-rose-500 hover:scale-110 transition-transform"><Navigation className="w-4 h-4" /></a>
                                )}
                                {row.china_maps && (
                                    <a href={row.china_maps} target="_blank" rel="noreferrer" className="text-amber-600 hover:scale-110 transition-transform"><ChinaMapIcon className="w-4 h-4" /></a>
                                )}
                            </div>
                        )
                    },
                    {
                        key: 'manage', header: '', minWidth: '100px', align: 'center',
                        render: (row) => (
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(row)}><Edit2 className="w-3.5 h-3.5" /></Button>
                                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setDeleteId(row.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                        )
                    }
                ]}
            />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((sup, i) => (
            <motion.div
              key={sup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border p-5 shadow-card glass-card-hover relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-24 h-24 gradient-primary opacity-5 blur-3xl -mr-12 -mt-12" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-primary shadow-lg flex items-center justify-center text-white font-black text-lg shrink-0">
                    {sup.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-base group-hover:text-primary transition-colors truncate">{sup.name}</h4>
                    </div>
                    <div className="flex items-center gap-1.5 overflow-hidden">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-sm shrink-0 shadow-sm ${sup.factory_grade === 'A' ? 'bg-emerald-500 text-white' : sup.factory_grade === 'B' ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'}`}>
                            {sup.factory_grade || 'A'} GRADE
                        </span>
                        <div className="flex gap-0.5 scale-75 origin-left">
                            <StarRating rating={sup.rating} onRate={(r) => updateSupplier(sup.id, { rating: r })} />
                        </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded-xl opacity-0 group-hover:opacity-100 hover:bg-muted transition-all bg-background/50 border border-border/50 shadow-sm">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                        </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-border/50">
                        <DropdownMenuItem onClick={() => handleEdit(sup)} className="gap-2 font-bold py-2">
                        <Edit2 className="w-4 h-4" /> تعديل المورد
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 font-bold py-2" onClick={() => setDeleteId(sup.id)}>
                        <Trash2 className="w-4 h-4" /> حذف المورد
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase mb-1">الرصيد المستحق</span>
                    <span className={`text-sm font-black ${sup.balanceUSD < 0 ? 'text-emerald-500' : sup.balanceUSD > 0 ? 'text-rose-500' : 'text-muted-foreground'}`}>
                        {sup.balanceUSD === 0 ? '--' : `$${formatNumber(Math.abs(sup.balanceUSD))}`}
                        <span className="text-[10px] mr-1 opacity-70">{sup.balanceUSD < 0 ? '(لنا)' : sup.balanceUSD > 0 ? '(مستحق)' : ''}</span>
                    </span>
                </div>
                <div className="flex gap-1.5">
                    <button 
                        onClick={() => { setActiveParty({id: sup.id, name: sup.name, type: 'supplier'}); setLedgerOpen(true); }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-background border border-border/60 hover:border-primary hover:text-primary transition-all shadow-sm group/btn"
                        title="كشف حساب"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => { setActiveParty({id: sup.id, name: sup.name, type: 'supplier'}); setVoucherOpen(true); }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500 hover:text-white transition-all shadow-sm"
                        title="سند دفع"
                    >
                        <Wallet className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {(sup.whatsapp || sup.wechat || sup.website || sup.facebook || sup.google_maps || sup.china_maps) && (
                <div className="flex flex-wrap items-center gap-2 mb-4 bg-background/30 p-2 rounded-xl border border-border/20">
                    {sup.whatsapp && (
                        <a href={`https://wa.me/${sup.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                            <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {sup.wechat && (
                        <button title={`WeChat ID: ${sup.wechat}`} className="w-7 h-7 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                            <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {sup.website && (
                        <a href={sup.website} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                            <Globe className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {sup.facebook && (
                        <a href={sup.facebook} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                            <Facebook className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {sup.google_maps && (
                        <a href={sup.google_maps} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                            <Navigation className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {sup.china_maps && (
                        <a href={sup.china_maps} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all">
                            <ChinaMapIcon className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[11px] text-muted-foreground mb-4">
                <div className="flex items-center gap-2 bg-background/40 p-2 rounded-xl border border-border/30">
                  <Factory className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold truncate">MOQ: <strong className="text-foreground">{sup.moq || 'Free'}</strong></span>
                </div>
                <div className="flex items-center gap-2 bg-background/40 p-2 rounded-xl border border-border/30">
                  <Clock className="w-3.5 h-3.5 text-secondary" />
                  <span className="font-bold truncate">{sup.lead_time_days || '15'} يوم</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-3 border-t border-border/40 mt-auto">
                <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3" />
                    <span className="font-bold">{sup.city}</span>
                </div>
                <div dir="ltr" className="font-mono font-bold text-foreground bg-muted/50 px-2 py-0.5 rounded-md">
                    {sup.phone}
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

      {activeParty && (
        <LedgerModal 
          open={ledgerOpen} 
          onOpenChange={setLedgerOpen} 
          targetId={activeParty.id} 
          targetName={activeParty.name} 
          type="supplier" 
        />
      )}

      <VoucherModal 
        open={voucherOpen} 
        onOpenChange={setVoucherOpen}
        defaultPartyId={activeParty?.id}
        defaultPartyName={activeParty?.name}
        defaultType="payment"
      />
    </div>
  );
}
