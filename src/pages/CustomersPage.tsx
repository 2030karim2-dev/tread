import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Phone, MapPin, Edit2, Trash2, MoreVertical, FileText, Users, TrendingUp, HandCoins, LayoutGrid, Table, MessageCircle, Globe, Facebook, Navigation, Map as ChinaMapIcon } from 'lucide-react';
import { PageHeader, EmptyState, TextField, SearchBar, ExportButton, ConfirmDialog, LedgerModal, VoucherModal, StatCard, EditableTable } from '@/components/shared';
import { Receipt } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useLedgers } from '@/hooks/useLedgers';
import { convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { customerSchema, CustomerFormData } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Customer } from '@/types';

const defaultValues: CustomerFormData = { 
  name: '', company_name: '', city: '', phone: '', 
  whatsapp: '', wechat: '', website: '', facebook: '', 
  google_maps: '', china_maps: '', notes: '' 
};

export default function CustomersPage() {
  const customers = useAppStore(s => s.customers);
  const suppliers = useAppStore(s => s.suppliers); // Added for VoucherModal party finding logic
  const addCustomer = useAppStore(s => s.addCustomer);
  const updateCustomer = useAppStore(s => s.updateCustomer);
  const deleteCustomer = useAppStore(s => s.deleteCustomer);
  const { getAllBalances } = useLedgers();

  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [cityFilter, setCityFilter] = useState('all');
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [voucherOpen, setVoucherOpen] = useState(false);
  const [view, setView] = useState<'cards' | 'table'>('cards');
  const [activeParty, setActiveParty] = useState<{id: string, name: string, type: 'customer' | 'supplier'} | null>(null);

  const balances = useMemo(() => getAllBalances(), [getAllBalances]);

  const totals = useMemo(() => {
    let totalReceivables = 0;
    customers.forEach(c => {
        const curBalances = balances[c.id] || {};
        Object.entries(curBalances).forEach(([cur, amt]) => {
            if (typeof amt !== 'number' || isNaN(amt)) return;
            try {
                totalReceivables += convertCurrency(amt, cur as any, 'USD');
            } catch (e) {}
        });
    });
    return { totalReceivables };
  }, [customers, balances]);

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
        whatsapp: editingCustomer.whatsapp || '',
        wechat: editingCustomer.wechat || '',
        website: editingCustomer.website || '',
        facebook: editingCustomer.facebook || '',
        google_maps: editingCustomer.google_maps || '',
        china_maps: editingCustomer.china_maps || '',
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
    }).map(c => ({
        ...c,
        balanceUSD: Object.entries(balances[c.id] || {}).reduce((acc, [cur, amt]) => {
            if (typeof amt !== 'number' || isNaN(amt)) return acc;
            try { return acc + convertCurrency(amt, cur as any, 'USD'); } catch(e) { return acc; }
        }, 0)
    }));
  }, [customers, search, cityFilter, balances]);

  const onSubmit = useCallback((d: CustomerFormData) => {
    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        ...d,
        company_name: d.company_name || '',
        notes: d.notes || ''
      });
      toast({ title: 'تم التحديث', description: 'تم تحديث العميل بنجاح' });
    } else {
      addCustomer({
        ...d,
        company_name: d.company_name || '',
        notes: d.notes || ''
      });
      toast({ title: 'تمت الإضافة', description: 'تم إضافة العميل بنجاح' });
    }
    setEditingCustomer(null);
    setOpen(false);
  }, [editingCustomer, updateCustomer, addCustomer]);

  const handleEdit = useCallback((customer: Customer) => {
    setEditingCustomer(customer);
    setOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteCustomer(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف العميل بنجاح' });
      setDeleteId(null);
    }
  }, [deleteId, deleteCustomer]);

  const exportColumns = useMemo(() => [
    { key: 'name', header: 'الاسم' },
    { key: 'company_name', header: 'الشركة' },
    { key: 'city', header: 'المدينة' },
    { key: 'phone', header: 'الهاتف' },
    { key: 'notes', header: 'ملاحظات' },
  ], []);

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
          <Button 
            variant="outline" 
            onClick={() => setVoucherOpen(true)}
            className="border-primary text-primary hover:bg-primary/10 gap-2 font-bold"
          >
            <Receipt className="w-4 h-4" /> سند قبض
          </Button>
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
              <div className="grid grid-cols-2 gap-3">
                <Controller name="whatsapp" control={control} render={({ field }) => (
                  <TextField label="واتساب" {...field} error={errors.whatsapp?.message || ''} />
                )} />
                <Controller name="wechat" control={control} render={({ field }) => (
                  <TextField label="ويشات" {...field} error={errors.wechat?.message || ''} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="website" control={control} render={({ field }) => (
                  <TextField label="رابط الموقع" {...field} error={errors.website?.message || ''} />
                )} />
                <Controller name="facebook" control={control} render={({ field }) => (
                  <TextField label="فيس بوك" {...field} error={errors.facebook?.message || ''} />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="google_maps" control={control} render={({ field }) => (
                  <TextField label="خرائط جوجل" {...field} error={errors.google_maps?.message || ''} />
                )} />
                <Controller name="china_maps" control={control} render={({ field }) => (
                  <TextField label="خرائط الصين" {...field} error={errors.china_maps?.message || ''} />
                )} />
              </div>
              <Controller name="notes" control={control} render={({ field }) => (
                <TextField label="ملاحظات" {...field} error={errors.notes?.message || ''} />
              )} />
              <Button onClick={handleSubmit(onSubmit)} className="w-full gradient-secondary text-secondary-foreground font-bold h-11 rounded-xl shadow-lg mt-2">
                {editingCustomer ? 'تحديث العميل' : 'حفظ العميل'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
            title="إجمالي العملاء" 
            value={customers.length} 
            icon={Users} 
            variant="default"
        />
        <StatCard 
            title="إجمالي الديون (لنا)" 
            value={`$${formatNumber(totals.totalReceivables)}`} 
            icon={TrendingUp} 
            variant="secondary"
        />
        <StatCard 
            title="توزيع المدن" 
            value={cities.length} 
            icon={MapPin} 
            variant="primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex-1">
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
        </div>
        <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-2xl border border-border/50 shadow-sm h-[52px]">
            <button
                onClick={() => setView('cards')}
                className={`p-2 rounded-xl transition-all ${view === 'cards' ? 'bg-background text-primary shadow-sm ring-1 ring-border/50' : 'text-muted-foreground hover:bg-background/50'}`}
                title="عرض البطاقات"
            >
                <LayoutGrid className="w-5 h-5" />
            </button>
            <button
                onClick={() => setView('table')}
                className={`p-2 rounded-xl transition-all ${view === 'table' ? 'bg-background text-primary shadow-sm ring-1 ring-border/50' : 'text-muted-foreground hover:bg-background/50'}`}
                title="عرض الجدول"
            >
                <Table className="w-5 h-5" />
            </button>
        </div>
      </div>

      {filteredCustomers.length === 0 ? (
        <EmptyState message={search || cityFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا يوجد عملاء بعد. أضف أول عميل!'} />
      ) : view === 'table' ? (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-xl glass-card">
            <EditableTable 
                data={filteredCustomers}
                columns={[
                    { key: 'name', header: 'الاسم', minWidth: '150px' },
                    { key: 'company_name', header: 'الشركة', minWidth: '150px' },
                    { key: 'city', header: 'المدينة', minWidth: '100px' },
                    { key: 'phone', header: 'الهاتف', minWidth: '120px' },
                    { 
                        key: 'balanceUSD', header: 'الرصيد', minWidth: '120px', align: 'center',
                        render: (row) => (
                            <span className={`font-black ${row.balanceUSD > 0 ? 'text-rose-500' : row.balanceUSD < 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                                {row.balanceUSD === 0 ? '--' : `$${formatNumber(Math.abs(row.balanceUSD))}`}
                                <span className="text-[10px] mr-1 opacity-70">{row.balanceUSD > 0 ? '(مدين)' : row.balanceUSD < 0 ? '(دائن)' : ''}</span>
                            </span>
                        )
                    },
                    {
                        key: 'actions', header: 'روابط', minWidth: '200px', align: 'center',
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
          {filteredCustomers.map((customer, i) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group bg-card rounded-2xl border border-border p-5 shadow-card glass-card-hover relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 w-24 h-24 gradient-secondary opacity-5 blur-3xl -mr-12 -mt-12" />
              
              <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl gradient-secondary shadow-lg flex items-center justify-center text-white font-black text-lg">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-black text-base group-hover:text-primary transition-colors">{customer.name}</h4>
                    {customer.company_name && (
                      <p className="text-xs text-muted-foreground font-bold">{customer.company_name}</p>
                    )}
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
                        <DropdownMenuItem onClick={() => handleEdit(customer)} className="gap-2 font-bold py-2">
                        <Edit2 className="w-4 h-4" /> تعديل البيانات
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive gap-2 font-bold py-2" onClick={() => setDeleteId(customer.id)}>
                        <Trash2 className="w-4 h-4" /> حذف العميل
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                    </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-muted/30 border border-border/40 mb-4">
                <div className="flex flex-col">
                    <span className="text-[10px] text-muted-foreground font-bold uppercase mb-1">الرصيد الحالي</span>
                    <span className={`text-sm font-black ${customer.balanceUSD > 0 ? 'text-rose-500' : customer.balanceUSD < 0 ? 'text-emerald-500' : 'text-muted-foreground'}`}>
                        {customer.balanceUSD === 0 ? '--' : `$${formatNumber(Math.abs(customer.balanceUSD))}`}
                        <span className="text-[10px] mr-1 opacity-70">{customer.balanceUSD > 0 ? '(مدين)' : customer.balanceUSD < 0 ? '(دائن)' : ''}</span>
                    </span>
                </div>
                <div className="flex gap-1.5">
                    <button 
                        onClick={() => { setActiveParty({id: customer.id, name: customer.name, type: 'customer'}); setLedgerOpen(true); }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-background border border-border/60 hover:border-primary hover:text-primary transition-all shadow-sm group/btn"
                        title="كشف حساب"
                    >
                        <FileText className="w-4 h-4" />
                    </button>
                    <button 
                        onClick={() => { setActiveParty({id: customer.id, name: customer.name, type: 'customer'}); setVoucherOpen(true); }}
                        className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        title="سند قبض"
                    >
                        <HandCoins className="w-4 h-4" />
                    </button>
                </div>
              </div>

              {(customer.whatsapp || customer.wechat || customer.website || customer.facebook || customer.google_maps || customer.china_maps) && (
                <div className="flex flex-wrap items-center gap-2 mb-4 bg-background/30 p-2 rounded-xl border border-border/20">
                    {customer.whatsapp && (
                        <a href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                            <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {customer.wechat && (
                        <button title={`WeChat ID: ${customer.wechat}`} className="w-7 h-7 rounded-lg bg-green-500/10 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition-all">
                            <MessageCircle className="w-3.5 h-3.5" />
                        </button>
                    )}
                    {customer.website && (
                        <a href={customer.website} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center hover:bg-blue-500 hover:text-white transition-all">
                            <Globe className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {customer.facebook && (
                        <a href={customer.facebook} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all">
                            <Facebook className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {customer.google_maps && (
                        <a href={customer.google_maps} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all">
                            <Navigation className="w-3.5 h-3.5" />
                        </a>
                    )}
                    {customer.china_maps && (
                        <a href={customer.china_maps} target="_blank" rel="noreferrer" className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center hover:bg-amber-600 hover:text-white transition-all">
                            <ChinaMapIcon className="w-3.5 h-3.5" />
                        </a>
                    )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 text-[11px] text-muted-foreground mt-auto">
                <div className="flex items-center gap-2 bg-background/40 p-2 rounded-xl border border-border/30">
                  <MapPin className="w-3.5 h-3.5 text-primary" />
                  <span className="font-bold truncate">{customer.city}</span>
                </div>
                <div className="flex items-center gap-2 bg-background/40 p-2 rounded-xl border border-border/30">
                  <Phone className="w-3.5 h-3.5 text-secondary" />
                  <span dir="ltr" className="font-mono">{customer.phone}</span>
                </div>
              </div>
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

      {activeParty && (
        <LedgerModal 
          open={ledgerOpen} 
          onOpenChange={setLedgerOpen} 
          targetId={activeParty.id} 
          targetName={activeParty.name} 
          type="customer" 
        />
      )}

      <VoucherModal 
        open={voucherOpen} 
        onOpenChange={setVoucherOpen}
        defaultPartyId={activeParty?.id}
        defaultPartyName={activeParty?.name}
        defaultType="receipt"
      />
    </div>
  );
}
