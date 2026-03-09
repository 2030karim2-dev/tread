import { useState, useCallback } from 'react';
import { Plus, FileText } from 'lucide-react';
import { PageHeader, EditableTable } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { formatNumber, generateId } from '@/lib/helpers';
import { Button } from '@/components/ui/button';

interface InvoiceItem {
  id: string;
  product_name: string;
  oem_number: string;
  brand: string;
  quantity: number;
  purchase_price: number;
  sale_price: number;
  size: string;
}

const defaultItems: InvoiceItem[] = [
  { id: '1', product_name: 'فلتر زيت تويوتا', oem_number: '04152-YZZA1', brand: 'Toyota', quantity: 500, purchase_price: 8, sale_price: 15, size: 'قياسي' },
  { id: '2', product_name: 'فلتر هواء كامري', oem_number: '17801-0H050', brand: 'Toyota', quantity: 300, purchase_price: 12, sale_price: 25, size: 'كبير' },
  { id: '3', product_name: 'تيل فرامل أمامي', oem_number: '04465-33471', brand: 'Toyota', quantity: 200, purchase_price: 18, sale_price: 35, size: 'أمامي' },
];

export default function PurchasesPage() {
  const [items, setItems] = useState<InvoiceItem[]>(defaultItems);

  const onCellChange = useCallback((id: string, field: string, value: string | number) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  }, []);

  const addRow = () => {
    setItems([...items, { id: generateId(), product_name: '', oem_number: '', brand: '', quantity: 0, purchase_price: 0, sale_price: 0, size: '' }]);
  };

  const total = items.reduce((s, i) => s + i.quantity * i.purchase_price, 0);

  const columns: ColumnDef<InvoiceItem>[] = [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '110px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    { key: 'purchase_price', header: 'سعر الشراء', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'total', header: 'الإجمالي', minWidth: '80px', editable: false, align: 'center', render: (row) => <span className="font-semibold">${formatNumber(row.quantity * row.purchase_price)}</span> },
  ];

  const footer = (
    <tr className="bg-muted/50 font-bold">
      <td colSpan={8} className="spreadsheet-cell text-sm">الإجمالي</td>
      <td className="spreadsheet-cell text-center text-sm">${formatNumber(total)}</td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <PageHeader title="فواتير الشراء">
        <Button onClick={addRow} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> إضافة صف
        </Button>
      </PageHeader>

      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg gradient-secondary"><FileText className="w-4 h-4 text-secondary-foreground" /></div>
          <div>
            <h4 className="font-bold text-sm">فاتورة شراء #INV-2025-001</h4>
            <p className="text-xs text-muted-foreground">المورد: Guangzhou Auto Parts Co. • الرحلة: قوانغتشو يناير 2025</p>
          </div>
        </div>
      </div>

      <EditableTable data={items} columns={columns} onCellChange={onCellChange} footer={footer} />
    </div>
  );
}
