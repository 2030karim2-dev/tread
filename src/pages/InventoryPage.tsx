import { PageHeader, EditableTable } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { InventoryItem } from '@/types';
import { formatNumber, safePercent } from '@/lib/helpers';

export default function InventoryPage() {
  const { inventory } = useAppStore();

  const totalAvailable = inventory.reduce((s, i) => s + i.quantity_available, 0);
  const totalValue = inventory.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);

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
      <PageHeader title="المخزون" />
      <EditableTable data={inventory} columns={columns} footer={footer} />
    </div>
  );
}
