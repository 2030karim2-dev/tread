import { Plus } from 'lucide-react';
import { PageHeader, EditableTable, StarRating, EmptyState } from '@/components/shared';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Product } from '@/types';
import { EMPTY_MESSAGES } from '@/constants';
import { Button } from '@/components/ui/button';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', oem_number: '', brand: '', size: '',
  purchase_price: 0, sale_price: 0, quantity: 0, notes: '', rating: 0,
};

export default function ProductsPage() {
  const { products, addProduct, updateProductField } = useAppStore();

  const columns: ColumnDef<Product>[] = [
    { key: 'name', header: 'اسم المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '120px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '90px' },
    { key: 'size', header: 'المقاس', minWidth: '70px' },
    { key: 'purchase_price', header: 'سعر الشراء', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'quantity', header: 'الكمية', minWidth: '60px', type: 'number', align: 'center' },
    {
      key: 'rating', header: 'التقييم', minWidth: '80px',
      render: (row) => <StarRating rating={row.rating} onRate={r => updateProductField(row.id, 'rating', r)} />,
    },
    { key: 'notes', header: 'ملاحظات', minWidth: '120px' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="المنتجات">
        <Button onClick={() => addProduct(emptyProduct)} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> إضافة صف
        </Button>
      </PageHeader>

      {products.length === 0 ? (
        <EmptyState message={EMPTY_MESSAGES.products} />
      ) : (
        <EditableTable
          data={products}
          columns={columns}
          onCellChange={updateProductField}
        />
      )}
    </div>
  );
}
