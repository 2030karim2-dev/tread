import { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Trash2, MoreVertical, Edit2, GitCompare, Package } from 'lucide-react';
import { PageHeader, EmptyState, ConfirmDialog, QuotationPreview, StatusBadge, SelectField, EditableTable, ColumnDef, ProductSelectionModal } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';
import { Quotation, QuotationItem, QuotationStatus } from '@/types';
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
  const [selectionOpen, setSelectionOpen] = useState(false);

  // Form state
  const [formSupplierId, setFormSupplierId] = useState('');
  const [formTripId, setFormTripId] = useState('');
  const [formDate, setFormDate] = useState<string>(new Date().toISOString().split('T')[0] || '');
  const [formType, setFormType] = useState<'incoming' | 'outgoing'>('outgoing');
  const [formCustomerName, setFormCustomerName] = useState('');
  const [formMargin, setFormMargin] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<QuotationStatus>('pending_sourcing');
  const [formNotes, setFormNotes] = useState('');
  const [formItems, setFormItems] = useState<QuotationItem[]>([]);
  const [formCurrency, setFormCurrency] = useState('USD');
  const [formAmountPaid, setFormAmountPaid] = useState(0);
  const [previewQuotation, setPreviewQuotation] = useState<Quotation | null>(null);

  const resetForm = () => {
    setFormSupplierId(''); setFormTripId('');
    setFormDate(new Date().toISOString().split('T')[0] || '');
    setFormType('outgoing');
    setFormCustomerName(''); setFormMargin(0);
    setFormStatus('pending_sourcing');
    setFormNotes(''); setFormItems([]);
    setFormCurrency('USD'); setFormAmountPaid(0);
    setEditingQuotation(null);
  };

  const handleEdit = useCallback((q: Quotation) => {
    setEditingQuotation(q);
    setFormSupplierId(q.supplier_id);
    setFormTripId(q.trip_id);
    setFormDate(q.date);
    setFormType(q.type || 'outgoing');
    setFormCustomerName(q.customer_name || '');
    setFormMargin(q.margin_percentage || 0);
    setFormStatus(q.status || 'pending_sourcing');
    setFormNotes(q.notes);
    setFormItems([...q.items]);
    setFormCurrency(q.currency || 'USD');
    setFormAmountPaid(q.amount_paid || 0);
    setOpen(true);
  }, []);

  const handleSubmit = useCallback(() => {
    if (!formSupplierId) {
      toast({ title: 'خطأ', description: 'يرجى اختيار المورد', variant: 'destructive' });
      return;
    }
    const data = {
      supplier_id: formSupplierId,
      trip_id: formTripId,
      type: formType,
      customer_name: formCustomerName,
      margin_percentage: formMargin,
      status: formStatus,
      date: formDate,
      notes: formNotes,
      items: formItems,
      currency: formCurrency,
      amount_paid: formAmountPaid,
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
  }, [formSupplierId, formTripId, formDate, formNotes, formItems, editingQuotation, updateQuotation, addQuotation]);

  const addItem = useCallback(() => {
    setFormItems([...formItems, {
      id: generateId(), product_name: '', oem_number: '', brand: '',
      quantity: 1, purchase_price: 0, size: '', notes: '',
    }]);
  }, [formItems]);

  const handleProductsSelect = useCallback((selectedProducts: any[]) => {
    const newItems: QuotationItem[] = selectedProducts.map(p => ({
      id: generateId(),
      product_name: p.name,
      oem_number: p.oem_number || '',
      brand: p.brand || '',
      quantity: 1,
      purchase_price: p.purchase_price || 0,
      size: p.size || '',
      notes: '',
    }));
    setFormItems([...formItems, ...newItems]);
    toast({ title: 'تمت الإضافة', description: `تم إضافة ${selectedProducts.length} منتج من الكتالوج` });
  }, [formItems]);


  const removeItem = useCallback((id: string) => {
    setFormItems(formItems.filter(i => i.id !== id));
  }, [formItems]);

  const handleCellChange = useCallback((id: string, field: string, value: string | number) => {
    setFormItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  }, []);

  const quotationColumns: ColumnDef<QuotationItem>[] = [
    { key: 'product_name', header: 'اسم المنتج', minWidth: '200px', editable: true },
    { key: 'oem_number', header: 'OEM Number', minWidth: '150px', editable: true, mono: true },
    { key: 'brand', header: 'العلامة التجارية', minWidth: '100px', editable: true },
    { key: 'size', header: 'المقاس', minWidth: '80px', editable: true },
    { key: 'quantity', header: 'الكمية', minWidth: '80px', editable: true, type: 'number', align: 'center' },
    { key: 'purchase_price', header: 'السعر ($)', minWidth: '100px', editable: true, type: 'number', align: 'center' },
    { key: 'notes', header: 'ملاحظات', minWidth: '150px', editable: true },
  ];

  const handleDelete = useCallback(() => {
    if (deleteId) {
      deleteQuotation(deleteId);
      setCompareIds(prev => prev.filter(id => id !== deleteId));
      toast({ title: 'تم الحذف', description: 'تم حذف عرض السعر بنجاح' });
      setDeleteId(null);
    }
  }, [deleteId, deleteQuotation]);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 2 ? [...prev, id] : [prev[1], id]
    );
  }, []);

  const comparedQuotations = useMemo(() =>
    compareIds.map(id => quotations.find(q => q.id === id)).filter(Boolean) as Quotation[],
    [compareIds, quotations]
  );

  const getSupplierName = useCallback((id: string) => suppliers.find(s => s.id === id)?.name || 'مورد غير محدد', [suppliers]);
  const getTripName = useCallback((id: string) => trips.find(t => t.id === id)?.name || '', [trips]);

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
          <DialogContent dir="rtl" className="max-w-[95vw] w-[95vw] h-[95vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2">
              <DialogTitle className="font-extrabold">
                {editingQuotation ? 'تعديل عرض السعر' : 'إضافة عرض سعر جديد'}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 pt-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-muted/20 p-4 rounded-2xl border border-border/50">
                <div className="md:col-span-4 flex bg-muted/50 p-1 rounded-xl mb-2">
                  <button type="button" onClick={() => setFormType('outgoing')} className={`flex-1 text-sm py-2 rounded-lg font-bold transition-all ${formType === 'outgoing' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    عرض مبيعات (للعميل) 🇾🇪
                  </button>
                  <button type="button" onClick={() => setFormType('incoming')} className={`flex-1 text-sm py-2 rounded-lg font-bold transition-all ${formType === 'incoming' ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                    تسعيرة مورد (من الصين) 🇨🇳
                  </button>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs font-bold px-1">المورد</Label>
                  <select value={formSupplierId} onChange={e => setFormSupplierId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background/50 backdrop-blur-sm px-3 text-sm focus:ring-2 ring-primary/20 transition-all outline-none">
                    <option value="">اختر المورد</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold px-1">الرحلة المرتبطة</Label>
                  <select value={formTripId} onChange={e => setFormTripId(e.target.value)}
                    className="w-full h-10 rounded-xl border border-input bg-background/50 backdrop-blur-sm px-3 text-sm focus:ring-2 ring-primary/20 transition-all outline-none">
                    <option value="">اختر الرحلة</option>
                    {trips.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs font-bold px-1">تاريخ العرض</Label>
                  <Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} className="rounded-xl bg-background/50" />
                </div>
                <div className="space-y-1.5">
                  <SelectField label="حالة العرض" value={formStatus} onChange={(v) => setFormStatus(v as QuotationStatus)} options={[
                    {value: 'pending_sourcing', label: 'قيد البحث والتسعير في الصين'},
                    {value: 'priced', label: 'تم الحصول على أسعار المصنع'},
                    {value: 'sent_to_customer', label: 'تم إرسال العرض للعميل'},
                    {value: 'approved', label: 'مقبول / بانتظار التحويل'},
                    {value: 'rejected', label: 'مرفوض'}
                  ]} />
                </div>

                {formType === 'outgoing' && (
                  <>
                    <div className="space-y-1.5 col-span-1 md:col-span-2">
                      <Label className="text-xs font-bold px-1">اسم العميل باليمن</Label>
                      <Input placeholder="مثال: شركة الأمانة للتجارة" value={formCustomerName} onChange={e => setFormCustomerName(e.target.value)} className="rounded-xl bg-background/50" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold px-1">العملة</Label>
                      <select value={formCurrency} onChange={e => setFormCurrency(e.target.value)}
                        className="w-full h-10 rounded-xl border border-input bg-background/50 backdrop-blur-sm px-3 text-sm focus:ring-2 ring-primary/20 transition-all outline-none">
                        <option value="USD">USD - دولار أمريكي 🇺🇸</option>
                        <option value="SAR">SAR - ريال سعودي 🇸🇦</option>
                        <option value="CNY">CNY - ريمينبي صيني 🇨🇳</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold px-1">العمولة المضافة (%)</Label>
                      <Input type="number" min="0" placeholder="5" value={formMargin || ''} onChange={e => setFormMargin(Number(e.target.value))} className="rounded-xl bg-background/50" />
                    </div>
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-primary/5 border border-primary/20 p-4 rounded-2xl">
                  <Label className="text-xs font-bold block mb-1">المبلغ الإجمالي</Label>
                  <p className="text-2xl font-black text-primary">
                    {formatNumber(formItems.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0))} <span className="text-xs">{formCurrency}</span>
                  </p>
                </div>
                <div className="bg-green-500/5 border border-green-500/20 p-4 rounded-2xl">
                  <Label className="text-xs font-bold block mb-1">المبلغ المدفوع</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="number" 
                      value={formAmountPaid} 
                      onChange={e => setFormAmountPaid(Number(e.target.value))} 
                      className="h-8 bg-transparent border-none p-0 text-2xl font-black text-green-600 focus-visible:ring-0" 
                    />
                    <span className="text-xs font-bold">{formCurrency}</span>
                  </div>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 p-4 rounded-2xl text-right">
                  <Label className="text-xs font-bold block mb-1">المبلغ المتبقي</Label>
                  <p className="text-2xl font-black text-orange-600">
                    {formatNumber(Math.max(0, formItems.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0) - formAmountPaid))} <span className="text-xs">{formCurrency}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col flex-1 min-h-0 border border-border/50 rounded-2xl overflow-hidden bg-card/30">
                <div className="flex items-center justify-between p-4 border-b border-border/50 bg-muted/20">
                  <div className="flex items-center gap-2">
                    <Label className="text-sm font-bold">جدول المنتجات (Excel View)</Label>
                    <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-mono">
                      {formItems.length} Products
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setSelectionOpen(true)} size="sm" variant="outline" className="gap-2 font-bold border-primary/20 hover:bg-primary/5 transition-all">
                      <Package className="w-4 h-4 text-primary" /> اختر من الكتالوج 📦
                    </Button>
                    <Button onClick={addItem} size="sm" className="gradient-primary shadow-colored-primary text-primary-foreground gap-2 font-bold px-4">
                      <Plus className="w-4 h-4" /> إضافة سطر فارغ
                    </Button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-hidden p-2">
                  <EditableTable
                    data={formItems}
                    columns={quotationColumns}
                    onCellChange={handleCellChange}
                    onDeleteRow={removeItem}
                    virtualize={true}
                  />
                  {formItems.length === 0 && (
                    <div className="h-40 flex flex-col items-center justify-center text-muted-foreground bg-muted/10 rounded-xl my-4 border border-dashed border-border">
                      <FileText className="w-8 h-8 mb-2 opacity-20" />
                      <p className="text-xs">اضغط على زر "إضافة منتج جديد" للبدء في تدوين عرض السعر</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <Button onClick={handleSubmit} className="flex-1 h-12 text-lg gradient-secondary text-secondary-foreground font-extrabold shadow-lg rounded-xl">
                  {editingQuotation ? 'تحديث وحفظ التغييرات' : 'اعتماد وحفظ عرض السعر'}
                </Button>
                <Button variant="outline" onClick={() => setOpen(false)} className="h-12 px-8 rounded-xl font-bold">
                  إلغاء
                </Button>
              </div>
            </div>
            <ProductSelectionModal 
              open={selectionOpen} 
              onOpenChange={setSelectionOpen} 
              onSelect={handleProductsSelect} 
            />
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
                className={`group bg-card rounded-2xl border p-5 shadow-card glass-card-hover cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-border'
                  }`}
                onClick={() => toggleCompare(q.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isSelected ? 'gradient-primary' : 'bg-muted'}`}>
                      <FileText className={`w-5 h-5 ${isSelected ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-bold text-sm">{supplierName}</h4>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold border ${q.type === 'incoming' ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                          {q.type === 'incoming' ? 'تسعيرة مورد 🇨🇳' : 'عرض مبيعات 🇾🇪'}
                        </span>
                        <StatusBadge status={q.status || 'pending_sourcing'} />
                      </div>
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
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setPreviewQuotation(q); }}>
                        <FileText className="w-4 h-4 ml-2" /> طباعة / PDF
                      </DropdownMenuItem>
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
          {comparedQuotations.length === 2 && comparedQuotations[0] && comparedQuotations[1] && (
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
                          <td className={`py-2 px-2 text-center font-bold ${diff > 0 ? 'text-red-500' : diff < 0 ? 'text-green-500' : 'text-muted-foreground'
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
      {/* Preview PDF Modal */}
      {previewQuotation && (
        <QuotationPreview quotation={previewQuotation} onClose={() => setPreviewQuotation(null)} />
      )}
    </div>
  );
}
