import { useState, useCallback, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Printer, Trash2, Package } from 'lucide-react';
import { PageHeader, EditableTable, ConfirmDialog, ProductSelectionModal } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber, generateId } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { InvoicePrint } from '@/components/shared/InvoicePrint';
import { useAppStore, StorePurchaseInvoice, StorePurchaseInvoiceItem } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export default function PurchasesPage() {
  const invoices = useAppStore(s => s.purchaseInvoices);
  const suppliers = useAppStore(s => s.suppliers);
  const trips = useAppStore(s => s.trips);
  const addPurchaseInvoice = useAppStore(s => s.addPurchaseInvoice);
  const updatePurchaseInvoice = useAppStore(s => s.updatePurchaseInvoice);
  const deletePurchaseInvoice = useAppStore(s => s.deletePurchaseInvoice);
  const shipments = useAppStore(s => s.shipments);

  const [activeId, setActiveId] = useState(invoices[0]?.id || '');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const activeInvoice = invoices.find(inv => inv.id === activeId) || invoices[0];
  if (!activeInvoice) {
    return (
      <div className="space-y-4">
        <PageHeader title="فواتير الشراء">
          <Button onClick={addInvoiceHandler} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> فاتورة جديدة
          </Button>
        </PageHeader>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-semibold mb-2">لا توجد فواتير شراء</h3>
          <p className="text-muted-foreground">أضف أول فاتورة شراء لبدء التتبع</p>
        </div>
      </div>
    );
  }

  const addInvoiceHandler = useCallback(() => {
    const num = invoices.length + 1;
    const newInv: Omit<StorePurchaseInvoice, 'id'> = {
      number: `INV-2025-${String(num).padStart(3, '0')}`,
      supplier_id: '', supplier_name: 'مورد جديد',
      trip_id: '', trip_name: '',
      date: new Date().toISOString().split('T')[0] ?? '',
      currency: 'USD',
      amount_paid: 0,
      items: [],
    };
    addPurchaseInvoice(newInv);
    toast({ title: 'تمت الإضافة', description: 'تم إنشاء فاتورة جديدة' });
  }, [invoices.length, addPurchaseInvoice]);

  const handlePrint = useCallback(() => window.print(), []);

  const onCellChange = useCallback((itemId: string, field: string, value: string | number) => {
    if (!activeInvoice) return;
    const updatedItems = activeInvoice.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updatePurchaseInvoice(activeInvoice.id, { items: updatedItems });
  }, [activeInvoice, updatePurchaseInvoice]);

  const addRow = useCallback(() => {
    if (!activeInvoice) return;
    const newItem: StorePurchaseInvoiceItem = {
      id: generateId(), product_name: '', oem_number: '', brand: '',
      quantity: 0, purchase_price: 0, sale_price: 0, size: '',
    };
    updatePurchaseInvoice(activeInvoice.id, { items: [...activeInvoice.items, newItem] });
  }, [activeInvoice, updatePurchaseInvoice]);

  const deleteRow = useCallback((itemId: string) => {
    if (!activeInvoice) return;
    updatePurchaseInvoice(activeInvoice.id, { items: activeInvoice.items.filter(i => i.id !== itemId) });
  }, [activeInvoice, updatePurchaseInvoice]);

  const handleProductsSelect = useCallback((selectedProducts: any[]) => {
    if (!activeInvoice) return;
    const newItems: StorePurchaseInvoiceItem[] = selectedProducts.map(p => ({
      id: generateId(),
      product_name: p.name,
      oem_number: p.oem_number || '',
      brand: p.brand || '',
      quantity: 1,
      purchase_price: p.purchase_price || 0,
      sale_price: p.sale_price || 0,
      size: p.size || '',
    }));
    updatePurchaseInvoice(activeInvoice.id, { items: [...activeInvoice.items, ...newItems] });
    toast({ title: 'تمت الإضافة', description: `تم إضافة ${selectedProducts.length} منتج للفاتورة` });
  }, [activeInvoice, updatePurchaseInvoice]);

  const handleDeleteInvoice = useCallback(() => {
    if (deleteId) {
      deletePurchaseInvoice(deleteId);
      if (activeId === deleteId) {
        setActiveId(invoices.find(i => i.id !== deleteId)?.id || '');
      }
      toast({ title: 'تم الحذف', description: 'تم حذف الفاتورة بنجاح' });
      setDeleteId(null);
    }
  }, [deleteId, activeId, deletePurchaseInvoice, invoices]);

  const handleSupplierChange = useCallback((supplierId: string) => {
    const supplier = suppliers.find(s => s.id === supplierId);
    updatePurchaseInvoice(activeInvoice.id, {
      supplier_id: supplierId,
      supplier_name: supplier?.name || '',
    });
  }, [activeInvoice, suppliers, updatePurchaseInvoice]);

  const handleTripChange = useCallback((tripId: string) => {
    const trip = trips.find(t => t.id === tripId);
    updatePurchaseInvoice(activeInvoice.id, {
      trip_id: tripId,
      trip_name: trip?.name || '',
    });
  }, [activeInvoice, trips, updatePurchaseInvoice]);

  const handleShipmentChange = useCallback((shipmentId: string) => {
    updatePurchaseInvoice(activeInvoice.id, { shipment_id: shipmentId });
  }, [activeInvoice, updatePurchaseInvoice]);

  const total = activeInvoice.items.reduce((s, i) => s + i.quantity * i.purchase_price, 0);

  const columns: ColumnDef<StorePurchaseInvoiceItem>[] = useMemo(() => [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '110px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    { key: 'purchase_price', header: 'سعر الشراء', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'total' as keyof StorePurchaseInvoiceItem, header: 'الإجمالي', minWidth: '80px', editable: false, align: 'center', render: (row) => <span className="font-semibold">${formatNumber(row.quantity * row.purchase_price)}</span> },
  ], []);

  const footer = useMemo(() => (
    <>
      <tr className="bg-muted/50 font-bold border-t-2 border-primary/20">
        <td colSpan={8} className="spreadsheet-cell text-sm">إجمالي الفاتورة</td>
        <td className="spreadsheet-cell text-center text-sm">{formatNumber(total)} <span className="text-[10px]">{activeInvoice.currency}</span></td>
      </tr>
      <tr className="bg-green-500/5 font-bold">
        <td colSpan={8} className="spreadsheet-cell text-sm text-green-600 italic">المبلغ المدفوع</td>
        <td className="spreadsheet-cell p-0">
          <input 
            type="number" 
            value={activeInvoice.amount_paid} 
            onChange={e => updatePurchaseInvoice(activeInvoice.id, { amount_paid: Number(e.target.value) })}
            className="w-full h-full bg-transparent border-none text-center text-sm text-green-700 focus:ring-1 ring-green-500 outline-none font-black"
          />
        </td>
      </tr>
      <tr className="bg-orange-500/10 font-bold">
        <td colSpan={8} className="spreadsheet-cell text-sm text-orange-600 italic">المبلغ المتبقي (Debt)</td>
        <td className="spreadsheet-cell text-center text-sm text-orange-700 font-black">
          {formatNumber(Math.max(0, total - activeInvoice.amount_paid))} <span className="text-[10px]">{activeInvoice.currency}</span>
        </td>
      </tr>
    </>
  ), [total, activeInvoice.amount_paid, activeInvoice.currency, activeInvoice.id, updatePurchaseInvoice]);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="فواتير الشراء">
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" /> طباعة
          </Button>
          <Button onClick={() => setSelectionOpen(true)} variant="outline" className="gap-2 font-bold border-primary/20 hover:bg-primary/5">
            <Package className="w-4 h-4 text-primary" /> اختر من الكتالوج
          </Button>
          <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> إضافة سطر فارغ
          </Button>
        </div>
      </PageHeader>

      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-64 shrink-0 space-y-2 hidden md:block">
          <Button onClick={addInvoiceHandler} variant="outline" className="w-full gap-2 mb-2">
            <Plus className="w-4 h-4" /> فاتورة جديدة
          </Button>
          {invoices.map((inv, i) => (
            <motion.button
              key={inv.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setActiveId(inv.id)}
              className={`w-full text-right p-3 rounded-xl border transition-all group/card ${inv.id === activeId
                ? 'bg-primary/10 border-primary/30 shadow-sm'
                : 'bg-card border-border hover:bg-muted/50'
                }`}
            >
              <div className="flex items-center gap-2">
                <div className={`p-1.5 rounded-lg ${inv.id === activeId ? 'gradient-primary' : 'bg-muted'}`}>
                  <FileText className={`w-3.5 h-3.5 ${inv.id === activeId ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs truncate">{inv.number}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{inv.supplier_name}</p>
                  <p className="text-[10px] text-muted-foreground">{inv.date}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setDeleteId(inv.id); }}
                  className="p-1 rounded opacity-0 group-hover/card:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Mobile invoice selector */}
        <div className="md:hidden w-full">
          <select
            value={activeId}
            onChange={e => setActiveId(e.target.value)}
            className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm mb-3"
          >
            {invoices.map(inv => (
              <option key={inv.id} value={inv.id}>{inv.number} — {inv.supplier_name}</option>
            ))}
          </select>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-6 min-w-0">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg gradient-secondary"><FileText className="w-4 h-4 text-secondary-foreground" /></div>
              <div>
                <h4 className="font-bold text-sm">فاتورة شراء #{activeInvoice.number}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-muted-foreground text-[10px]">المورد</label>
                <select
                  value={activeInvoice.supplier_id}
                  onChange={e => handleSupplierChange(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="">اختر المورد</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted-foreground text-[10px]">الرحلة</label>
                <select
                  value={activeInvoice.trip_id}
                  onChange={e => handleTripChange(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="">اختر الرحلة</option>
                  {trips.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-muted-foreground text-[10px]">العملة</label>
                <select
                  value={activeInvoice.currency}
                  onChange={e => updatePurchaseInvoice(activeInvoice.id, { currency: e.target.value })}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-bold"
                >
                  <option value="USD">USD - دولار 🇺🇸</option>
                  <option value="SAR">SAR - ريال 🇸🇦</option>
                  <option value="CNY">CNY - ين ريمبامبي 🇨🇳</option>
                </select>
              </div>
              <div className="col-span-1">
                <label className="text-muted-foreground text-[10px]">الشحنة / الحاوية</label>
                <select
                  value={activeInvoice.shipment_id || ''}
                  onChange={e => handleShipmentChange(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs font-bold text-primary"
                >
                  <option value="">بانتظار التحميل...</option>
                  {shipments.map(s => (
                    <option key={s.id} value={s.id}>{s.shipment_number}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <EditableTable data={activeInvoice.items} columns={columns} onCellChange={onCellChange} onDeleteRow={deleteRow} footer={footer} />
        </div>
      </div>

      {/* Hidden print layout */}
      <div className="hidden print:block">
        <InvoicePrint
          ref={printRef}
          type="purchase"
          invoiceNumber={activeInvoice.number}
          date={activeInvoice.date}
          partyName={activeInvoice.supplier_name}
          items={activeInvoice.items.map(i => ({ ...i, price: i.purchase_price }))}
        />
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف الفاتورة"
        description="هل أنت متأكد من حذف هذه الفاتورة؟ لا يمكن التراجع عن هذا الإجراء."
        confirmText="حذف"
        onConfirm={handleDeleteInvoice}
        variant="destructive"
      />
      
      <ProductSelectionModal 
        open={selectionOpen} 
        onOpenChange={setSelectionOpen} 
        onSelect={handleProductsSelect} 
      />
    </div>
  );
}
