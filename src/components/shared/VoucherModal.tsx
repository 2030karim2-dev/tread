import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TextField, SelectField } from '@/components/shared';
import { useAppStore, Voucher } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { generateId } from '@/lib/helpers';
import { Receipt, Wallet, Calendar, Coins, StickyNote, Hash } from 'lucide-react';

interface VoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultPartyId?: string;
  defaultPartyName?: string;
  defaultType: 'receipt' | 'payment';
}

export function VoucherModal({ open, onOpenChange, defaultPartyId, defaultPartyName, defaultType }: VoucherModalProps) {
  const addVoucher = useAppStore(s => s.addVoucher);
  const suppliers = useAppStore(s => s.suppliers);
  const customers = useAppStore(s => s.customers);

  const { control, handleSubmit, reset, watch, setValue } = useForm<Omit<Voucher, 'id'>>({
    defaultValues: {
      number: `VCH-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split('T')[0],
      party_id: defaultPartyId || '',
      party_name: defaultPartyName || '',
      party_type: defaultType === 'payment' ? 'supplier' : 'customer',
      type: defaultType,
      amount: 0,
      currency: 'USD',
      notes: ''
    }
  });

  useEffect(() => {
    if (open) {
      reset({
        number: `VCH-${Date.now().toString().slice(-6)}`,
        date: new Date().toISOString().split('T')[0],
        party_id: defaultPartyId || '',
        party_name: defaultPartyName || '',
        party_type: defaultType === 'payment' ? 'supplier' : 'customer',
        type: defaultType,
        amount: 0,
        currency: 'USD',
        notes: ''
      });
    }
  }, [open, defaultPartyId, defaultPartyName, defaultType, reset]);

  const selectedPartyId = watch('party_id');
  
  // Update party name when party ID changes
  useEffect(() => {
    if (selectedPartyId) {
        const party = defaultType === 'payment' 
            ? suppliers.find(s => s.id === selectedPartyId)
            : customers.find(c => c.id === selectedPartyId);
        if (party) setValue('party_name', party.name);
    }
  }, [selectedPartyId, defaultType, suppliers, customers, setValue]);

  const onSubmit = (data: Omit<Voucher, 'id'>) => {
    if (!data.party_id) {
        toast({ title: 'خطأ', description: 'يرجى اختيار الطرف (المورد/العميل)', variant: 'destructive' });
        return;
    }
    if (data.amount <= 0) {
        toast({ title: 'خطأ', description: 'يجب أن يكون المبلغ أكبر من صفر', variant: 'destructive' });
        return;
    }

    addVoucher(data);
    toast({ 
        title: 'تم الحفظ', 
        description: `تم إضافة ${data.type === 'payment' ? 'سند الدفع' : 'سند القبض'} بنجاح` 
    });
    onOpenChange(false);
  };

  const parties = defaultType === 'payment' ? suppliers : customers;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-md border-border/50 shadow-2xl overflow-hidden p-0 bg-background/95 backdrop-blur-xl">
        <DialogHeader className={`p-6 text-white shadow-lg ${defaultType === 'payment' ? 'gradient-secondary' : 'gradient-primary'}`}>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30">
                {defaultType === 'payment' ? <Wallet className="w-6 h-6" /> : <Receipt className="w-6 h-6" />}
             </div>
             <div>
                <DialogTitle className="text-xl font-black">{defaultType === 'payment' ? 'إنشاء سند دفع' : 'إنشاء سند قبض'}</DialogTitle>
                <DialogDescription className="text-xs opacity-80 font-bold text-white/90">تسجيل حركات النقدية المستقلة</DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <Controller name="number" control={control} render={({ field }) => (
                    <TextField label="رقم السند" {...field} icon={<Hash className="w-3.5 h-3.5" />} />
                )} />
                <Controller name="date" control={control} render={({ field }) => (
                    <TextField label="التاريخ" type="date" {...field} icon={<Calendar className="w-3.5 h-3.5" />} />
                )} />
            </div>

            <Controller name="party_id" control={control} render={({ field }) => (
                <SelectField 
                    label={defaultType === 'payment' ? 'المورد' : 'العميل'} 
                    options={parties.map(p => ({ value: p.id, label: p.name }))}
                    {...field}
                />
            )} />

            <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                    <Controller name="amount" control={control} render={({ field: { value, onChange, ...f } }) => (
                        <TextField 
                            label="المبلغ" 
                            type="number" 
                            value={value || ''}
                            onChange={(v) => onChange(Number(v))}
                            {...f} 
                            icon={<Coins className="w-3.5 h-3.5" />}
                        />
                    )} />
                </div>
                <Controller name="currency" control={control} render={({ field }) => (
                    <SelectField 
                        label="العملة" 
                        options={[{value:'USD', label:'USD'}, {value:'SAR', label:'SAR'}, {value:'CNY', label:'CNY'}]}
                        {...field}
                    />
                )} />
            </div>

            <Controller name="notes" control={control} render={({ field }) => (
                <TextField label="ملاحظات وتفاصيل" {...field} icon={<StickyNote className="w-3.5 h-3.5" />} />
            )} />

            <Button 
                onClick={handleSubmit(onSubmit)} 
                className={`w-full h-11 text-white font-black text-sm rounded-xl shadow-lg transition-all active:scale-95 ${defaultType === 'payment' ? 'gradient-secondary shadow-colored-secondary' : 'gradient-primary shadow-colored-primary'}`}
            >
                حفظ السند واعتماده
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
