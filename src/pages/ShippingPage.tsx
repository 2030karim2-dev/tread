import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageHeader, StatusBadge, TextField, ConfirmDialog, ExportButton } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { STATUS_LABELS, SHIPPING_TYPES, CONTAINER_TYPES } from '@/constants';
import { shipmentSchema, ShipmentFormData } from '@/lib/validation';
import { Ship, MapPin, Package, DollarSign, Weight, Calendar, Anchor, Clock, Check, Plus, Edit2, Trash2, MoreVertical, Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatNumber } from '@/lib/helpers';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Shipment, PurchaseInvoice } from '@/types';

const TIMELINE_STAGES = ['purchased', 'production', 'at_warehouse', 'shipped', 'in_transit', 'arrived', 'delivered'] as const;
const STAGE_ICONS: Record<string, React.ElementType> = {
  purchased: Package,
  production: Clock,
  at_warehouse: Anchor,
  shipped: Ship,
  in_transit: Ship,
  arrived: MapPin,
  delivered: Check,
};

const statusProgress: Record<string, number> = {
  purchased: 10,
  production: 25,
  at_warehouse: 40,
  shipped: 55,
  in_transit: 70,
  arrived: 85,
  delivered: 100,
};

const defaultValues: ShipmentFormData = {
  shipment_number: '', shipping_company: '', shipping_type: 'sea',
  departure_port: '', arrival_port: '', ship_date: '', expected_arrival_date: '',
  shipping_cost: 0, weight: 0, cartons_count: 0, cbm: 0, container_type: '20ft',
};

export default function ShippingPage() {
  const shipments = useAppStore(s => s.shipments);
  const addShipment = useAppStore(s => s.addShipment);
  const updateShipment = useAppStore(s => s.updateShipment);
  const deleteShipment = useAppStore(s => s.deleteShipment);
  const purchaseInvoices = useAppStore(s => s.purchaseInvoices);

  const [open, setOpen] = useState(false);
  const [showManifest, setShowManifest] = useState<string | null>(null);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentSchema),
    defaultValues,
  });

  const onSubmit = (d: ShipmentFormData) => {
    if (editingShipment) {
      updateShipment(editingShipment.id, d);
      toast({ title: 'تم التحديث', description: 'تم تحديث الشحنة بنجاح' });
    } else {
      addShipment({ ...d, status: 'purchased' });
      toast({ title: 'تمت الإضافة', description: 'تم إضافة الشحنة بنجاح' });
    }
    setEditingShipment(null);
    setOpen(false);
  };

  const handleEdit = (shipment: Shipment) => {
    setEditingShipment(shipment);
    reset({
      shipment_number: shipment.shipment_number,
      shipping_company: shipment.shipping_company,
      shipping_type: shipment.shipping_type,
      departure_port: shipment.departure_port,
      arrival_port: shipment.arrival_port,
      ship_date: shipment.ship_date,
      expected_arrival_date: shipment.expected_arrival_date,
      shipping_cost: shipment.shipping_cost,
      weight: shipment.weight,
      cartons_count: shipment.cartons_count,
      cbm: shipment.cbm,
      container_type: shipment.container_type as any,
    });
    setOpen(true);
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteShipment(deleteId);
      toast({ title: 'تم الحذف', description: 'تم حذف الشحنة بنجاح' });
      setDeleteId(null);
    }
  };

  const advanceStatus = (shipment: Shipment) => {
    const currentIdx = TIMELINE_STAGES.indexOf(shipment.status as typeof TIMELINE_STAGES[number]);
    if (currentIdx < TIMELINE_STAGES.length - 1) {
      updateShipment(shipment.id, { status: TIMELINE_STAGES[currentIdx + 1] });
      toast({ title: 'تم تحديث الحالة', description: `الحالة: ${STATUS_LABELS[TIMELINE_STAGES[currentIdx + 1]]}` });
    }
  };
  const exportColumns = useMemo(() => [
    { key: 'shipment_number', header: 'رقم الشحنة' },
    { key: 'shipping_company', header: 'شركة الشحن' },
    { key: 'status', header: 'الحالة' },
    { key: 'departure_port', header: 'ميناء المغادرة' },
    { key: 'arrival_port', header: 'ميناء الوصول' },
    { key: 'ship_date', header: 'تاريخ الشحن' },
    { key: 'expected_arrival_date', header: 'تاريخ الوصول المتوقع' },
    { key: 'shipping_cost', header: 'التكلفة ($)' },
    { key: 'weight', header: 'الوزن (كغ)' },
    { key: 'cartons_count', header: 'عدد الكراتين' },
    { key: 'cbm', header: 'الحجم (CBM)' },
    { key: 'container_type', header: 'نوع الحاوية' },
  ], []);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="إدارة الشحنات" subtitle={`${shipments.length} شحنة`}>
        <ExportButton data={shipments} columns={exportColumns} filename="سجل-الشحنات" />
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { reset(defaultValues); setEditingShipment(null); } }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> شحنة جديدة
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                {editingShipment ? 'تعديل الشحنة' : 'إضافة شحنة جديدة'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              <div className="grid grid-cols-2 gap-3">
                <Controller name="shipment_number" control={control} render={({ field }) => (
                  <TextField label="رقم الشحنة" {...field} error={errors.shipment_number?.message} placeholder="SHP-2025-003" />
                )} />
                <Controller name="shipping_company" control={control} render={({ field }) => (
                  <TextField label="شركة الشحن" {...field} error={errors.shipping_company?.message} placeholder="ميرسك" />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">نوع الشحن</label>
                  <Controller name="shipping_type" control={control} render={({ field }) => (
                    <select {...field} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                      {SHIPPING_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  )} />
                </div>
                <Controller name="shipping_cost" control={control} render={({ field }) => (
                  <TextField label="التكلفة ($)" value={String(field.value)} onChange={v => field.onChange(Number(v) || 0)} error={errors.shipping_cost?.message} type="number" />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="departure_port" control={control} render={({ field }) => (
                  <TextField label="ميناء المغادرة" {...field} error={errors.departure_port?.message} placeholder="قوانغتشو" />
                )} />
                <Controller name="arrival_port" control={control} render={({ field }) => (
                  <TextField label="ميناء الوصول" {...field} error={errors.arrival_port?.message} placeholder="عدن" />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="ship_date" control={control} render={({ field }) => (
                  <TextField label="تاريخ الشحن" {...field} error={errors.ship_date?.message} type="date" />
                )} />
                <Controller name="expected_arrival_date" control={control} render={({ field }) => (
                  <TextField label="تاريخ الوصول المتوقع" {...field} error={errors.expected_arrival_date?.message} type="date" />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="weight" control={control} render={({ field }) => (
                  <TextField label="الوزن الإجمالي (كغ)" value={String(field.value)} onChange={v => field.onChange(Number(v) || 0)} error={errors.weight?.message} type="number" />
                )} />
                <Controller name="cartons_count" control={control} render={({ field }) => (
                  <TextField label="عدد الكراتين" value={String(field.value)} onChange={v => field.onChange(Number(v) || 0)} error={errors.cartons_count?.message} type="number" />
                )} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Controller name="cbm" control={control} render={({ field }) => (
                  <TextField label="الحجم الكلي (CBM)" value={String(field.value)} onChange={v => field.onChange(Number(v) || 0)} error={errors.cbm?.message} type="number" step="0.01" />
                )} />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">نوع الحاوية</label>
                  <Controller name="container_type" control={control} render={({ field }) => (
                    <select {...field} className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                      {CONTAINER_TYPES.map(t => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  )} />
                </div>
              </div>
              <Button onClick={handleSubmit(onSubmit)} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editingShipment ? 'تحديث الشحنة' : 'حفظ الشحنة'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="grid gap-2 sm:gap-3 lg:gap-4 lg:grid-cols-2">
        {shipments.map((s, i) => {
          const progress = statusProgress[s.status] || 0;
          const currentIdx = TIMELINE_STAGES.indexOf(s.status as typeof TIMELINE_STAGES[number]);
          const canAdvance = currentIdx < TIMELINE_STAGES.length - 1;

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-card rounded-2xl border border-border p-5 shadow-card glass-card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary shadow-colored-primary flex items-center justify-center">
                    <Ship className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{s.shipment_number}</h4>
                    <p className="text-xs text-muted-foreground">{s.shipping_company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.status} />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setShowManifest(s.id)}>
                        <FileText className="w-4 h-4 ml-2" />
                        عرض البيان (Manifest)
                      </DropdownMenuItem>
                      {canAdvance && (
                        <DropdownMenuItem onClick={() => advanceStatus(s)}>
                          <Check className="w-4 h-4 ml-2" />
                          تقديم الحالة
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem onClick={() => handleEdit(s)}>
                        <Edit2 className="w-4 h-4 ml-2" />
                        تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(s.id)}>
                        <Trash2 className="w-4 h-4 ml-2" />
                        حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Route visualization */}
              <div className="mb-4 p-3 bg-muted/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                      <Anchor className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[10px] font-bold">{s.departure_port}</p>
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full gradient-secondary rounded-full"
                      />
                    </div>
                    <Ship className="w-4 h-4 text-secondary absolute top-1/2 -translate-y-1/2 bg-card p-0.5 rounded"
                      style={{ left: `${Math.min(progress - 5, 90)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-1">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold">{s.arrival_port}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4 px-2">
                <div className="flex items-center justify-between">
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const StageIcon = STAGE_ICONS[stage];
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const isFuture = idx > currentIdx;

                    return (
                      <div key={stage} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? 'bg-accent border-accent text-accent-foreground'
                                : isCurrent
                                ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20'
                                : 'bg-muted border-border text-muted-foreground'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <StageIcon className="w-3 h-3" />
                            )}
                          </motion.div>
                          <p className={`text-[9px] mt-1 text-center leading-tight max-w-[50px] ${
                            isCurrent ? 'font-bold text-primary' : isFuture ? 'text-muted-foreground' : 'font-medium text-accent'
                          }`}>
                            {STATUS_LABELS[stage]}
                          </p>
                        </div>
                        {idx < TIMELINE_STAGES.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 rounded-full mt-[-14px] ${
                            idx < currentIdx ? 'bg-accent' : 'bg-border'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-4 gap-2 text-xs">
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <Calendar className="w-3.5 h-3.5 mx-auto mb-1 text-primary" />
                  <p className="text-[10px] text-muted-foreground">شحن</p>
                  <p className="font-semibold">{s.ship_date}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-secondary" />
                  <p className="text-[10px] text-muted-foreground">وصول متوقع</p>
                  <p className="font-semibold">{s.expected_arrival_date}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <Package className="w-3.5 h-3.5 mx-auto mb-1 text-accent" />
                  <p className="text-[10px] text-muted-foreground">الحجم</p>
                  <p className="font-semibold">{s.cbm} CBM</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <DollarSign className="w-3.5 h-3.5 mx-auto mb-1 text-success" />
                  <p className="text-[10px] text-muted-foreground">التكلفة</p>
                  <p className="font-semibold">${s.shipping_cost.toLocaleString()}</p>
                </div>
              </div>

              {/* Container Fill Visualization */}
              {s.shipping_type === 'sea' && s.container_type !== 'LCL' && (
                <div className="mt-4 p-3 border border-dashed border-border/60 rounded-xl bg-muted/20">
                  <div className="flex items-center justify-between mb-2 text-[10px] font-bold">
                    <span className="text-muted-foreground">سعة {s.container_type} المستغلة</span>
                    <span className="text-primary">{((s.cbm / (CONTAINER_TYPES.find(t => t.value === s.container_type)?.capacity || 1)) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden relative shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((s.cbm / (CONTAINER_TYPES.find(t => t.value === s.container_type)?.capacity || 1)) * 100, 100)}%` }}
                      className={`h-full rounded-full transition-all ${
                        (s.cbm / (CONTAINER_TYPES.find(t => t.value === s.container_type)?.capacity || 1)) > 0.9 ? 'bg-red-500' : 'gradient-primary'
                      }`}
                    />
                  </div>
                  <p className="text-[9px] text-muted-foreground mt-1 text-center">
                    متبقي {Math.max((CONTAINER_TYPES.find(t => t.value === s.container_type)?.capacity || 0) - s.cbm, 0).toFixed(2)} CBM في هذه الحاوية
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {s.cartons_count} كرتون
                  </span>
                  <span className="flex items-center gap-1">
                    <Weight className="w-3 h-3" />
                    {s.weight} كغ
                  </span>
                </div>
                <span className="font-medium">{s.shipping_type === 'sea' ? '🚢 بحري' : '✈️ جوي'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Manifest Dialog */}
      <Dialog open={showManifest !== null} onOpenChange={(v) => !v && setShowManifest(null)}>
        <DialogContent dir="rtl" className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-extrabold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              بيان محتويات الشحنة (Container Manifest)
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 mt-4">
            {showManifest && (() => {
              const shipment = shipments.find(s => s.id === showManifest);
              const linkedInvoices = purchaseInvoices.filter(inv => inv.shipment_id === showManifest);
              
              if (linkedInvoices.length === 0) {
                return (
                  <div className="text-center py-10 bg-muted/20 rounded-2xl border border-dashed border-border">
                    <Package className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground">لا توجد فواتير مرتبطة بهذه الشحنة حالياً.</p>
                    <p className="text-xs text-muted-foreground mt-1">اربط الفواتير من صفحة "المشتريات" لتظهر هنا.</p>
                  </div>
                );
              }

              const totalItems = linkedInvoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.quantity, 0), 0);
              const totalCost = linkedInvoices.reduce((acc, inv) => acc + inv.items.reduce((s, i) => s + i.quantity * i.purchase_price, 0), 0);

              return (
                <>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                      <p className="text-[10px] text-primary font-bold uppercase mb-1">إجمالي الفواتير</p>
                      <p className="text-2xl font-black">{linkedInvoices.length}</p>
                    </div>
                    <div className="bg-secondary/5 p-4 rounded-xl border border-secondary/10">
                      <p className="text-[10px] text-secondary font-bold uppercase mb-1">إجمالي القطع</p>
                      <p className="text-2xl font-black">{totalItems}</p>
                    </div>
                    <div className="bg-accent/5 p-4 rounded-xl border border-accent/10">
                      <p className="text-[10px] text-accent font-bold uppercase mb-1">قيمة المشتريات</p>
                      <p className="text-2xl font-black">${formatNumber(totalCost)}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {linkedInvoices.map(inv => (
                      <div key={inv.id} className="border rounded-xl overflow-hidden bg-card shadow-sm">
                        <div className="bg-muted/50 px-4 py-2 border-b flex items-center justify-between">
                          <span className="text-xs font-bold">فاتورة #{inv.number}</span>
                          <span className="text-xs text-muted-foreground">{inv.supplier_name}</span>
                        </div>
                        <table className="w-full text-right text-xs">
                          <thead>
                            <tr className="bg-muted/30 text-muted-foreground">
                              <th className="py-2 px-3 font-medium">المنتج</th>
                              <th className="py-2 px-3 font-medium text-center">رقم OEM</th>
                              <th className="py-2 px-3 font-medium text-center">الكمية</th>
                              <th className="py-2 px-3 font-medium text-center">السعر</th>
                            </tr>
                          </thead>
                          <tbody>
                            {inv.items.map(item => (
                              <tr key={item.id} className="border-t border-border/40">
                                <td className="py-2 px-3 font-semibold">{item.product_name}</td>
                                <td className="py-2 px-3 text-center font-mono opacity-70">{item.oem_number}</td>
                                <td className="py-2 px-3 text-center font-bold">{item.quantity}</td>
                                <td className="py-2 px-3 text-center font-bold">${item.purchase_price}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ))}
                  </div>
                  
                  <div className="pt-4 border-t flex justify-end gap-3 print:hidden">
                    <Button onClick={() => window.print()} variant="outline" className="gap-2">
                      <Printer className="w-4 h-4" /> طباعة المانيفيست
                    </Button>
                    <Button onClick={() => setShowManifest(null)}>إغلاق</Button>
                  </div>
                </>
              );
            })()}
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الشحنة"
        description="هل أنت متأكد من حذف هذه الشحنة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
