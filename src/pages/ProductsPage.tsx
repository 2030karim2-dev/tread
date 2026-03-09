import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EditableTable, StarRating, EmptyState, SearchBar, ExportButton } from '@/components/shared';
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
  const { products, addProduct, updateProductField, deleteProduct } = useAppStore();
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.oem_number.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
      return matchesSearch && matchesBrand;
    });
  }, [products, search, brandFilter]);

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

  const exportColumns = [
    { key: 'name', header: 'اسم المنتج' },
    { key: 'oem_number', header: 'رقم OEM' },
    { key: 'brand', header: 'العلامة' },
    { key: 'size', header: 'المقاس' },
    { key: 'purchase_price', header: 'سعر الشراء' },
    { key: 'sale_price', header: 'سعر البيع' },
    { key: 'quantity', header: 'الكمية' },
    { key: 'rating', header: 'التقييم' },
    { key: 'notes', header: 'ملاحظات' },
  ];

  return (
    <div className="space-y-4">
      <PageHeader title="المنتجات" subtitle={`${products.length} منتج`}>
        <ExportButton data={filteredProducts} columns={exportColumns} filename="المنتجات" />
        <Button onClick={() => addProduct(emptyProduct)} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> إضافة صف
        </Button>
      </PageHeader>

      <SearchBar
        placeholder="ابحث عن منتج أو رقم OEM..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'brand',
            label: 'العلامة التجارية',
            options: brands.map(b => ({ value: b, label: b })),
            value: brandFilter,
            onChange: setBrandFilter,
          },
        ]}
      />

      {filteredProducts.length === 0 ? (
        <EmptyState message={search || brandFilter !== 'all' ? 'لا توجد نتائج مطابقة' : EMPTY_MESSAGES.products} />
      ) : (
        <EditableTable
          data={filteredProducts}
          columns={columns}
          onCellChange={updateProductField}
          onDeleteRow={deleteProduct}
        />
      )}
    </div>
  );
}
