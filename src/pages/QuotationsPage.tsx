import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, MoreVertical, Edit2, GitCompare } from 'lucide-react';
import { PageHeader, EmptyState, ConfirmDialog } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Quotation, QuotationItem } from '@/types';
import { generateId, formatNumber } from '@/lib/helpers';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function QuotationsPage() {
  const quotations = useAppStore(s => s.quotations);
  const suppliers = useAppStore(s => s.suppliers);
  const trips = useAppStore(s => s.trips);
  const addQuotation = useAppStore(s => s.addQuotation);
  const updateQuotation = useAppStore(s => s.updateQuotation);
  const deleteQuotation = useAppStore(s => s.deleteQuotation);

  const [open, setOpen] = useState(false);
  const [editingQuotation, setEditingQuotation] = useState<Quotation | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);

  // Form state
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formTripId, setFormTripId] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<QuotationItem[]>([]);

  const resetForm = () => {
    setFormSupplierId(''); setFormTripId('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormNotes(''); setFormItems([]);
    setEditingQuotation(null);
  };

  const handleEdit = (q: Quotation) => {
    setEditingQuotation(q);
    setFormSupplierId(q.supplier_id);
    setFormTripId(q.trip_id);
    setFormDate(q.date);
    setFormNotes(q.notes);
    setFormItems([...q.items]);
    setOpen(true);
  };

  const handleSubmit = () => {
    if (!formSupplierId) {
      toast({ title: 'خطأ', description: 'يرجى اختيار المورد', variant: 'destructive' });
      return;
    }
    const data = {
      supplier_id: formSupplierId,
      trip_id: formTripId,
      date: formDate,
      notes: formNotes,
      items: formItems,
    };
    if (editingQuotation) {
      updateQuotation(editingQuotation.id, data);
      toast({ title: 'تم التحديث', description: 'تم تحديث عرض السعر بنجاح' });
    } else {
      addQuotation(data);
      toast({ title: 'تمت الإضافة', description: 'تم إضافة عرض السعر بنجاح' });
    }
    resetForm();
    setOpen(false);
  };

  const addItem = () => {
    setFormItems([...formItems, {
      id: generateId(), product_name: '', oem_number: '', brand: '',
      quantity: 0, purchase_price: 0, size: '', notes: '',
    }]);
  };

  const updateItem = (idx: number, field: keyof QuotationItem, value: string | number) => {
    const updated = [...formItems];
    (updated[idx] as Record<string, unknown>)[field] = value;
    setFormItems(updated);
  };

  const removeItem = (idx: number) => {
    setFormItems(formItems.filter((_, i) => i !== idx));
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteQuotation(deleteId);
      setCompareIds(prev => prev.filter(id => id !== deleteId));
      toast({ title: 'تم الحذف', description: 'تم حذف عرض السعر بنجاح' });
      setDeleteId(null);
    }
  };

  const toggleCompare = (id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  };

  const comparedQuotations = useMemo(() =>
    compareIds.map(id => quotations.find(q => q.id === id)).filter(Boolean) as Quotation[],
    [compareIds, quotations]
  );

  const getSupplierName = (id: string) => suppliers.find(s => s.id === id)?.name || 'مورد غير محدد';
  const getTripName = (id: string) => trips.find(t => t.id === id)?.name || '';

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="عروض الأسعار" subtitle={`${quotations.length} عرض سعر`}>
        {compareIds.length === 2 && (
          <Button onClick={() => setShowCompare(true)} variant="outline" className="gap-2">
            <GitCompare className="w-4 h-4" /> مقارنة
          </Button>
        )}
        <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gradient-secondary shadow-colored-secondary text-secondary-foreground gap-2 font-bold">
              <Plus className="w-4 h-4" /> عرض سعر جديد
            </Button>
          </DialogTrigger>
          <DialogContent dir="rtl" className="max-w-2xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-extrabold">
                {editingQuotation ? 'تعديل عرض السعر' : 'إضافة عرض سعر جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">المورد</Label>
                  <select value={formSupplierId} onChange={e => setFormSupplierId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">اختر المورد</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">الرحلة</Label>
                  <select value={formTripId} onChange={e => setFormTripId(e.target.value)}
                    className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm">
                    <option value="">اختر الرحلة</option>
                    {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">التاريخ</Label>
                  <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-bold">المنتجات</Label>
                  <Button onClick={addItem} size="sm" variant="outline" className="gap-1 text-xs">
                    <Plus className="w-3 h-3" /> إضافة منتج
                  </Button>
                </div>
                <div className="space-y-2 max-h-[40vh] overflow-y-auto">
                  {formItems.map((item, idx) => (
                    <div key={item.id} className="grid grid-cols-6 gap-2 items-end bg-muted/30 p-2 rounded-lg">
                      <div>
                        <label className="text-[10px] text-muted-foreground">المنتج</label>
                        <Input value={item.product_name} onChange={e => updateItem(idx, 'product_name', e.target.value)} className="h-8 text-xs" />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">OEM</label>
                        <Input value={item.oem_number} onChange={e => updateItem(idx, 'oem_number', e.target.value)} className="h-8 text-xs font-mono" />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">العلامة</label>
                        <Input value={item.brand} onChange={e => updateItem(idx, 'brand', e.target.value)} className="h-8 text-xs" />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">الكمية</label>
                        <Input type="number" value={item.quantity} onChange={e => updateItem(idx, 'quantity', Number(e.target.value))} className="h-8 text-xs" />
                      </div>
                      <div>
                        <label className="text-[10px] text-muted-foreground">السعر</label>
                        <Input type="number" step="0.01" value={item.purchase_price} onChange={e => updateItem(idx, 'purchase_price', Number(e.target.value))} className="h-8 text-xs" />
                      </div>
                      <Button onClick={() => removeItem(idx)} size="sm" variant="ghost" className="h-8 text-destructive hover:text-destructive">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                  {formItems.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center py-4">لا توجد منتجات — أضف منتجاً أولاً</p>
                  )}
                </div>
              </div>

              <Button onClick={handleSubmit} className="w-full gradient-secondary text-secondary-foreground font-bold">
                {editingQuotation ? 'تحديث عرض السعر' : 'حفظ عرض السعر'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </PageHeader>

      {quotations.length === 0 ? (
        <EmptyState message="لا توجد عروض أسعار بعد. أضف أول عرض سعر!" />
      ) : (
        <div className="grid gap-2 sm:gap-3 lg:gap-4 lg:grid-cols-2">
          {quotations.map((q, i) => {
            const supplierName = getSupplierName(q.supplier_id);
            const tripName = getTripName(q.trip_id);
            const qTotal = q.items.reduce((s, item) => s + item.quantity * item.purchase_price, 0);
            const isSelected = compareIds.includes(q.id);

            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`group bg-card rounded-2xl border p-5 shadow-card glass-card-hover cursor-pointer transition-all ${
                  isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                }`}
                onClick={() => toggleCompare(q.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'gradient-primary' : 'bg-muted'}`}>
                      <FileText className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{supplierName}</h4>
                      <p className="text-xs text-muted-foreground">{tripName} • {q.date}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button onClick={e => e.stopPropagation()} className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-muted transition-all">
                        <MoreVertical className="w-4 h-4 text-muted-foreground" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEdit(q); }}>
                        <Edit2 className="w-4 h-4 ml-2" /> تعديل
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); setDeleteId(q.id); }}>
                        <Trash2 className="w-4 h-4 ml-2" /> حذف
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-1.5 mb-3">
                  {q.items.slice(0, 3).map(item => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-muted/30 rounded-lg px-3 py-1.5">
                      <span className="truncate flex-1">{item.product_name}</span>
                      <span className="font-mono text-muted-foreground mx-2">{item.oem_number}</span>
                      <span className="font-bold">${item.purchase_price}</span>
                    </div>
                  ))}
                  {q.items.length > 3 && (
                    <p className="text-xs text-muted-foreground text-center">+{q.items.length - 3} منتج آخر</p>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50 text-xs">
                  <span className="text-muted-foreground">{q.items.length} منتج</span>
                  <span className="font-bold text-primary">${formatNumber(qTotal)}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Compare Modal */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent dir="rtl" className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-extrabold">مقارنة عروض الأسعار</DialogTitle>
          </DialogHeader>
          {comparedQuotations.length === 2 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {comparedQuotations.map(q => (
                  <div key={q.id} className="bg-muted/30 rounded-xl p-3">
                    <h4 className="font-bold text-sm mb-1">{getSupplierName(q.supplier_id)}</h4>
                    <p className="text-xs text-muted-foreground">{q.date}</p>
                  </div>
                ))}
              </div>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-right py-2 px-2 font-bold">المنتج</th>
                    <th className="text-center py-2 px-2 font-bold">{getSupplierName(comparedQuotations[0].supplier_id)}</th>
                    <th className="text-center py-2 px-2 font-bold">{getSupplierName(comparedQuotations[1].supplier_id)}</th>
                    <th className="text-center py-2 px-2 font-bold">الفرق</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const allProducts = [...new Set([
                      ...comparedQuotations[0].items.map(i => i.oem_number),
                      ...comparedQuotations[1].items.map(i => i.oem_number),
                    ])];
                    return allProducts.map(oem => {
                      const item1 = comparedQuotations[0].items.find(i => i.oem_number === oem);
                      const item2 = comparedQuotations[1].items.find(i => i.oem_number === oem);
                      const price1 = item1?.purchase_price || 0;
                      const price2 = item2?.purchase_price || 0;
                      const diff = price1 - price2;
                      return (
                        <tr key={oem} className="border-b border-border/50">
                          <td className="py-2 px-2">
                            <p className="font-medium">{item1?.product_name || item2?.product_name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono">{oem}</p>
                          </td>
                          <td className="py-2 px-2 text-center font-mono">{price1 ? `$${price1}` : '—'}</td>
                          <td className="py-2 px-2 text-center font-mono">{price2 ? `$${price2}` : '—'}</td>
                          <td className={`py-2 px-2 text-center font-bold ${
                            diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-muted-foreground'
                          }`}>
                            {diff !== 0 ? `${diff > 0 ? '+' : ''}${diff.toFixed(2)}` : '—'}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف عرض السعر"
        description="هل أنت متأكد من حذف عرض السعر؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDelete}
        variant="destructive"
      />
    </div>
  );
}
