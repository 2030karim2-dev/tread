import { useState } from 'react';
import { PageHeader, EditableTable } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { InventoryItem } from '@/types';
import { formatNumber } from '@/lib/helpers';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Filter, X } from 'lucide-react';

export default function InventoryPage() {
  const { inventory } = useAppStore();
  const [showLowOnly, setShowLowOnly] = useState(false);

  const lowStockItems = inventory.filter(i => {
    const pct = (i.quantity_available / i.quantity_purchased) * 100;
    return pct < 30;
  });

  const displayData = showLowOnly ? lowStockItems : inventory;
  const totalAvailable = displayData.reduce((s, i) => s + i.quantity_available, 0);
  const totalValue = displayData.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);

  const columns: ColumnDef<InventoryItem>[] = [
    { key: 'product_name', header: 'المنتج', editable: false },
    { key: 'oem_number', header: 'رقم OEM', editable: false, mono: true },
    { key: 'brand', header: 'العلامة', editable: false },
    { key: 'quantity_purchased', header: 'المشتراة', editable: false, align: 'center' },
    { key: 'quantity_sold', header: 'المباعة', editable: false, align: 'center' },
    {
      key: 'quantity_available', header: 'المتوفرة', align: 'center',
      render: (row) => (
        <span className={`font-bold ${row.quantity_available < 50 ? 'text-destructive' : 'text-accent'}`}>
          {row.quantity_available}
        </span>
      ),
    },
    { key: 'purchase_price', header: 'سعر الشراء', editable: false, align: 'center', render: (row) => <span>${row.purchase_price}</span> },
    { key: 'sale_price', header: 'سعر البيع', editable: false, align: 'center', render: (row) => <span>${row.sale_price}</span> },
    {
      key: 'value', header: 'القيمة', align: 'center',
      render: (row) => <span className="font-semibold">${formatNumber(row.quantity_available * row.sale_price)}</span>,
    },
  ];

  const footer = (
    <tr className="bg-muted/50 font-bold">
      <td colSpan={6} className="spreadsheet-cell text-sm">الإجمالي</td>
      <td className="spreadsheet-cell text-center text-sm">{formatNumber(totalAvailable)}</td>
      <td colSpan={2} className="spreadsheet-cell" />
      <td className="spreadsheet-cell text-center text-sm">${formatNumber(totalValue)}</td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <PageHeader title="المخزون">
        <Button
          variant={showLowOnly ? 'default' : 'outline'}
          onClick={() => setShowLowOnly(!showLowOnly)}
          className="gap-2"
        >
          {showLowOnly ? <X className="w-4 h-4" /> : <Filter className="w-4 h-4" />}
          {showLowOnly ? 'عرض الكل' : `المخزون المنخفض (${lowStockItems.length})`}
        </Button>
      </PageHeader>

      {lowStockItems.length > 0 && !showLowOnly && (
        <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle className="font-bold">تنبيه: مخزون منخفض</AlertTitle>
          <AlertDescription className="text-sm">
            {lowStockItems.length} منتجات بمخزون أقل من 30%:{' '}
            <span className="font-semibold">{lowStockItems.map(i => i.product_name).join('، ')}</span>
          </AlertDescription>
        </Alert>
      )}

      <EditableTable data={displayData} columns={columns} footer={footer} />
    </div>
  );
}
