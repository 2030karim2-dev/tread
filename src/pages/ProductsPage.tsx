import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { PageHeader, EditableTable, StarRating, EmptyState, SearchBar, ExportButton, BarcodeScanner } from '@/components/shared';
import { SmartIngestModal } from '@/features/catalog/components/SmartIngestModal';
import { AIDataEnricher } from '@/features/catalog/components/AIDataEnricher';
import { LandedCostCalculator } from '@/features/catalog/components/LandedCostCalculator';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Product } from '@/types';
import { Button } from '@/components/ui/button';

const emptyProduct: Omit<Product, 'id'> = {
  name: '', name_zh: '', name_en: '', oem_number: '', brand: '', size: '',
  cost_rmb: 0, purchase_price: 0, sale_price: 0, quantity: 0, notes: '', rating: 0,
  oem_alternatives: '', vehicle_compatibility: '', specifications: '', unit: 'قطعة',
};

export default function ProductsPage() {
  const products = useAppStore(s => s.products);
  const addProduct = useAppStore(s => s.addProduct);
  const updateProductField = useAppStore(s => s.updateProductField);
  const updateProduct = useAppStore(s => s.updateProduct);
  const deleteProduct = useAppStore(s => s.deleteProduct);

  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');

  const brands = useMemo(() => [...new Set(products.map(p => p.brand).filter(Boolean))], [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.oem_number.toLowerCase().includes(search.toLowerCase()) ||
        (p.oem_alternatives && p.oem_alternatives.toLowerCase().includes(search.toLowerCase())) ||
        p.brand.toLowerCase().includes(search.toLowerCase());
      const matchesBrand = brandFilter === 'all' || p.brand === brandFilter;
      return matchesSearch && matchesBrand;
    });
  }, [products, search, brandFilter]);

  const columns: ColumnDef<Product>[] = [
    { 
        key: 'name', header: 'الاسم (عربي)', minWidth: '220px',
        render: (row) => (
            <div className="space-y-2">
                <span className="font-bold">{row.name}</span>
                <AIDataEnricher 
                    initialName={row.name} 
                    oemNumber={row.oem_number}
                    oemAlternatives={row.oem_alternatives}
                    onSuggest={(data) => updateProduct(row.id, data)} 
                />
            </div>
        )
    },
    { key: 'name_en', header: 'En', minWidth: '100px' },
    { key: 'name_zh', header: 'Zh', minWidth: '100px' },
    { key: 'oem_number', header: 'رقم الوكالة OEM', minWidth: '160px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '100px' },
    { key: 'size', header: 'المقاس', minWidth: '90px' },
    { 
        key: 'unit', header: 'الوحدة', minWidth: '90px',
        render: (row) => (
            <select 
                value={row.unit || 'قطعة'} 
                onChange={(e) => updateProductField(row.id, 'unit', e.target.value)}
                className="bg-transparent border-none focus:ring-0 text-xs font-bold w-full text-center cursor-pointer hover:text-primary transition-colors"
            >
                {['قطعة', 'طقم', 'درزن', 'متر', 'كيلو'].map(u => <option key={u} value={u}>{u}</option>)}
            </select>
        )
    },
    { key: 'oem_alternatives', header: 'الأرقام البديلة', minWidth: '150px', mono: true },
    { key: 'vehicle_compatibility', header: 'تناسب سيارات', minWidth: '200px' },
    { key: 'cost_rmb', header: 'التكلفة باليوان (¥)', minWidth: '120px', type: 'number', align: 'center' },
    { 
        key: 'purchase_price', header: 'سعر الشراء (واصل)', minWidth: '130px', type: 'number', align: 'center',
        render: (row) => (
            <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-emerald-600 font-bold">${row.purchase_price}</span>
                <LandedCostCalculator 
                    unitCostRmb={row.cost_rmb} 
                    onApply={(landed, suggested) => updateProduct(row.id, { 
                        purchase_price: landed, 
                        sale_price: Math.round(suggested) 
                    })} 
                />
            </div>
        )
    },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '100px', type: 'number', align: 'center' },
    { key: 'quantity', header: 'الكمية', minWidth: '80px', type: 'number', align: 'center' },
    {
      key: 'rating', header: 'التقييم', minWidth: '80px',
      render: (row) => <StarRating rating={row.rating || 0} onRate={r => updateProductField(row.id, 'rating', r)} />,
    },
    { key: 'specifications', header: 'المواصفات', minWidth: '200px' },
    { key: 'notes', header: 'ملاحظات', minWidth: '120px' },
  ];

  const exportColumns = [
    { key: 'name', header: 'الاسم (عربي)' },
    { key: 'name_en', header: 'الاسم (English)' },
    { key: 'name_zh', header: 'الاسم (中文)' },
    { key: 'oem_number', header: 'رقم الوكالة OEM' },
    { key: 'brand', header: 'العلامة' },
    { key: 'size', header: 'المقاس' },
    { key: 'oem_alternatives', header: 'الأرقام البديلة' },
    { key: 'vehicle_compatibility', header: 'تناسب سيارات' },
    { key: 'specifications', header: 'المواصفات' },
    { key: 'cost_rmb', header: 'التكلفة (¥)' },
    { key: 'purchase_price', header: 'سعر الشراء (واصل)' },
    { key: 'sale_price', header: 'سعر البيع' },
    { key: 'quantity', header: 'الكمية' },
    { key: 'rating', header: 'التقييم' },
    { key: 'notes', header: 'ملاحظات' },
  ];

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="المنتجات" subtitle={`${products.length} منتج`}>
        <SmartIngestModal />
        <ExportButton data={filteredProducts} columns={exportColumns} filename="المنتجات" />
        <Button onClick={() => addProduct(emptyProduct)} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> إضافة صف
        </Button>
      </PageHeader>

      <SearchBar
        placeholder="ابحث عن منتج أو رقم OEM..."
        value={search}
        onChange={setSearch}
        actionButton={<BarcodeScanner onResult={(res) => setSearch(res)} />}
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
        <EmptyState message={search || brandFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا توجد منتجات بعد. أضف أول منتج!'} />
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
