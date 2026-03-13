import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, FileText, Printer, Trash2 } from 'lucide-react';
import { PageHeader, EditableTable, ConfirmDialog } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber, generateId } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { InvoicePrint } from '@/components/shared/InvoicePrint';
import { useAppStore, StoreSalesInvoice, StoreSalesInvoiceItem } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';

export default function SalesPage() {
  const invoices = useAppStore(s => s.salesInvoices);
  const customers = useAppStore(s => s.customers);
  const addSalesInvoice = useAppStore(s => s.addSalesInvoice);
  const updateSalesInvoice = useAppStore(s => s.updateSalesInvoice);
  const deleteSalesInvoice = useAppStore(s => s.deleteSalesInvoice);

  const [activeId, setActiveId] = useState(invoices[0]?.id || '');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const activeInvoice = invoices.find(inv => inv.id === activeId) || invoices[0];

  function addInvoiceHandler() {
    const num = invoices.length + 1;
    const newInv: Omit<StoreSalesInvoice, 'id'> = {
      number: `SALE-2025-${String(num).padStart(3, '0')}`,
      customer_id: '', customer_name: 'عميل جديد',
      date: new Date().toISOString().split('T')[0],
      items: [],
    };
    addSalesInvoice(newInv);
    toast({ title: 'تمت الإضافة', description: 'تم إنشاء فاتورة بيع جديدة' });
  }

  if (!activeInvoice) {
    return (
      <div className="space-y-4">
        <PageHeader title="فواتير البيع">
          <Button onClick={addInvoiceHandler} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> فاتورة جديدة
          </Button>
        </PageHeader>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-6xl mb-4">🧾</div>
          <h3 className="text-lg font-semibold mb-2">لا توجد فواتير بيع</h3>
          <p className="text-muted-foreground">أضف أول فاتورة بيع لبدء التتبع</p>
        </div>
      </div>
    );
  }

  const handlePrint = () => window.print();

  const onCellChange = useCallback((itemId: string, field: string, value: string | number) => {
    if (!activeInvoice) return;
    const updatedItems = activeInvoice.items.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    updateSalesInvoice(activeInvoice.id, { items: updatedItems });
  }, [activeInvoice, updateSalesInvoice]);

  const addRow = () => {
    if (!activeInvoice) return;
    const newItem: StoreSalesInvoiceItem = {
      id: generateId(), product_name: '', oem_number: '', brand: '',
      quantity: 0, sale_price: 0, size: '',
    };
    updateSalesInvoice(activeInvoice.id, { items: [...activeInvoice.items, newItem] });
  };

  const deleteRow = (itemId: string) => {
    if (!activeInvoice) return;
    updateSalesInvoice(activeInvoice.id, { items: activeInvoice.items.filter(i => i.id !== itemId) });
  };

  const handleDeleteInvoice = () => {
    if (deleteId) {
      deleteSalesInvoice(deleteId);
      if (activeId === deleteId) {
        setActiveId(invoices.find(i => i.id !== deleteId)?.id || '');
      }
      toast({ title: 'تم الحذف', description: 'تم حذف الفاتورة بنجاح' });
      setDeleteId(null);
    }
  };

  const handleCustomerChange = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    updateSalesInvoice(activeInvoice.id, {
      customer_id: customerId,
      customer_name: customer?.name || '',
    });
  };

  const total = activeInvoice.items.reduce((s, i) => s + i.quantity * i.sale_price, 0);

  const columns: ColumnDef<StoreSalesInvoiceItem>[] = [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '110px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'total', header: 'الإجمالي', minWidth: '80px', editable: false, align: 'center', render: (row) => <span className="font-semibold">${formatNumber(row.quantity * row.sale_price)}</span> },
  ];

  const footer = (
    <tr className="bg-muted/50 font-bold">
      <td colSpan={7} className="spreadsheet-cell text-sm">الإجمالي</td>
      <td className="spreadsheet-cell text-center text-sm">${formatNumber(total)}</td>
    </tr>
  );

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="فواتير البيع">
        <div className="flex gap-2">
          <Button onClick={handlePrint} variant="outline" className="gap-2">
            <Printer className="w-4 h-4" /> طباعة
          </Button>
          <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" /> إضافة صف
          </Button>
        </div>
      </PageHeader>

      <div className="flex gap-4">
        {/* Sidebar - hidden on mobile */}
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
              className={`w-full text-right p-3 rounded-xl border transition-all group/card ${
                inv.id === activeId
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
                  <p className="text-[10px] text-muted-foreground truncate">{inv.customer_name}</p>
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
              <option key={inv.id} value={inv.id}>{inv.number} — {inv.customer_name}</option>
            ))}
          </select>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-3 sm:space-y-4 lg:space-y-6 min-w-0">
          <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg gradient-secondary"><FileText className="w-4 h-4 text-secondary-foreground" /></div>
              <div>
                <h4 className="font-bold text-sm">فاتورة بيع #{activeInvoice.number}</h4>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-muted-foreground text-[10px]">العميل</label>
                <select
                  value={activeInvoice.customer_id}
                  onChange={e => handleCustomerChange(e.target.value)}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                >
                  <option value="">اختر العميل</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-muted-foreground text-[10px]">التاريخ</label>
                <input
                  type="date"
                  value={activeInvoice.date}
                  onChange={e => updateSalesInvoice(activeInvoice.id, { date: e.target.value })}
                  className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
                />
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
          type="sale"
          invoiceNumber={activeInvoice.number}
          date={activeInvoice.date}
          partyName={activeInvoice.customer_name}
          items={activeInvoice.items.map(i => ({ ...i, price: i.sale_price, purchase_price: 0 }))}
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
    </div>
  );
}
