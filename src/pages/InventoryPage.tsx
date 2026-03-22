import { useState, useMemo, useCallback } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { PageHeader, EditableTable, EmptyState, SearchBar, ExportButton, LedgerModal } from '@/components/shared';
import { FileText } from 'lucide-react';
import type { ColumnDef } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { InventoryItem } from '@/types';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { useProductIntelligence } from '@/hooks/useProductIntelligence';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const emptyItem: Omit<InventoryItem, 'id'> = {
  product_name: '', oem_number: '', brand: '',
  quantity_purchased: 0, quantity_sold: 0, quantity_available: 0,
  purchase_price: 0, sale_price: 0,
};

export default function InventoryPage() {
  const inventory = useAppStore(s => s.inventory);
  const addInventoryItem = useAppStore(s => s.addInventoryItem);
  const updateInventoryField = useAppStore(s => s.updateInventoryField);
  const deleteInventoryItem = useAppStore(s => s.deleteInventoryItem);
  const { getSuppliersForProduct } = useProductIntelligence();

  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [ledgerOpen, setLedgerOpen] = useState(false);
  const [activeLedger, setActiveLedger] = useState<{id: string, name: string} | null>(null);

  const lowStockItems = useMemo(() => inventory.filter(item => item.quantity_available <= 10), [inventory]);
  const totalValue = useMemo(() => inventory.reduce((sum, item) => sum + item.quantity_available * item.sale_price, 0), [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      const matchesSearch = search === '' ||
        item.product_name.toLowerCase().includes(search.toLowerCase()) ||
        item.oem_number.toLowerCase().includes(search.toLowerCase()) ||
        item.brand.toLowerCase().includes(search.toLowerCase());
      const matchesStock = stockFilter === 'all' ||
        (stockFilter === 'low' && item.quantity_available <= 10) ||
        (stockFilter === 'available' && item.quantity_available > 10) ||
        (stockFilter === 'out' && item.quantity_available === 0);
      return matchesSearch && matchesStock;
    });
  }, [inventory, search, stockFilter]);

  const columns: ColumnDef<InventoryItem>[] = useMemo(() => [
    { key: 'product_name', header: 'المنتج', minWidth: '140px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '120px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '80px' },
    { key: 'quantity_purchased', header: 'المشترى', minWidth: '70px', type: 'number', align: 'center' },
    { key: 'quantity_sold', header: 'المباع', minWidth: '70px', type: 'number', align: 'center' },
    {
      key: 'quantity_available', header: 'المتاح', minWidth: '70px', type: 'number', align: 'center',
      render: (row) => (
        <span className={`font-bold ${row.quantity_available <= 10 ? 'text-red-500' : 'text-green-600'}`}>
          {row.quantity_available}
        </span>
      ),
    },
    { key: 'purchase_price', header: 'سعر الشراء', minWidth: '80px', type: 'number', align: 'center' },
    { key: 'sale_price', header: 'سعر البيع', minWidth: '80px', type: 'number', align: 'center' },
    {
      key: 'margin' as any, header: 'الهامش %', minWidth: '70px', editable: false, align: 'center',
      render: (row) => {
        const margin = row.purchase_price > 0 ? ((row.sale_price - row.purchase_price) / row.purchase_price * 100) : 0;
        return (
          <span className={`font-semibold ${margin > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {margin.toFixed(0)}%
          </span>
        );
      },
    },
    {
      key: 'suppliers' as any,
      header: 'الموردين',
      minWidth: '120px',
      render: (row) => {
        const history = getSuppliersForProduct(row.oem_number);
        if (history.length === 0) return <span className="text-[9px] text-muted-foreground/40 italic">لا يوجد سجل</span>;
        
        return (
          <TooltipProvider>
            <div className="flex flex-wrap gap-1">
              {history.slice(0, 2).map((h, i) => (
                <Tooltip key={`${h.supplierId}-${i}`}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className={`text-[8px] px-1 py-0 h-3.5 border-primary/10 bg-primary/5`}>
                      {h.supplierName.substring(0, 8)}..
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs p-2">
                    <p className="font-bold">{h.supplierName}</p>
                    <p className="text-primary font-black">{formatNumber(h.lastPrice)} {h.currency}</p>
                    <p className="text-[10px] opacity-70">{h.date} ({h.type === 'purchase' ? 'شراء' : 'عرض'})</p>
                  </TooltipContent>
                </Tooltip>
              ))}
              {history.length > 2 && <span className="text-[8px] text-muted-foreground">+{history.length - 2}</span>}
            </div>
          </TooltipProvider>
        );
      }
    },
    {
      key: 'value' as any, header: 'القيمة', minWidth: '90px', editable: false, align: 'center',
      render: (row) => <span className="font-semibold">${formatNumber(row.quantity_available * row.sale_price)}</span>,
    },
    {
      key: 'action' as any, header: 'السجل', minWidth: '50px', editable: false, align: 'center',
      render: (row) => (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary transition-all"
          onClick={() => { setActiveLedger({id: row.oem_number, name: row.product_name}); setLedgerOpen(true); }}
        >
          <FileText className="w-4 h-4" />
        </Button>
      )
    },
  ], []);

  const exportColumns = useMemo(() => [
    { key: 'product_name', header: 'المنتج' },
    { key: 'oem_number', header: 'رقم OEM' },
    { key: 'brand', header: 'العلامة' },
    { key: 'quantity_purchased', header: 'المشترى' },
    { key: 'quantity_sold', header: 'المباع' },
    { key: 'quantity_available', header: 'المتاح' },
    { key: 'purchase_price', header: 'سعر الشراء' },
    { key: 'sale_price', header: 'سعر البيع' },
  ], []);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="المخزون" subtitle={`${inventory.length} منتج • القيمة: $${formatNumber(totalValue)}`}>
        <ExportButton data={filteredInventory} columns={exportColumns} filename="المخزون" />
        <Button onClick={useCallback(() => addInventoryItem(emptyItem), [addInventoryItem])} className="gradient-primary text-primary-foreground gap-2">
          <Plus className="w-4 h-4" /> إضافة منتج
        </Button>
      </PageHeader>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <div>
            <p className="text-sm font-bold text-red-700 dark:text-red-300">
              تنبيه مخزون منخفض
            </p>
            <p className="text-xs text-red-600 dark:text-red-400">
              {lowStockItems.length} منتج تحت الحد الأدنى ({lowStockItems.map(i => i.product_name).join('، ')})
            </p>
          </div>
        </div>
      )}

      <SearchBar
        placeholder="ابحث في المخزون..."
        value={search}
        onChange={setSearch}
        filters={[
          {
            key: 'stock',
            label: 'حالة المخزون',
            options: [
              { value: 'available', label: 'متاح (أكثر من 10)' },
              { value: 'low', label: 'منخفض (10 أو أقل)' },
              { value: 'out', label: 'نفد' },
            ],
            value: stockFilter,
            onChange: setStockFilter,
          },
        ]}
      />

      {filteredInventory.length === 0 ? (
        <EmptyState message={search || stockFilter !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا يوجد مخزون بعد'} />
      ) : (
        <EditableTable
          data={filteredInventory}
          columns={columns}
          onCellChange={useCallback((id: string, field: string, value: string | number) => updateInventoryField(id, field, value), [updateInventoryField])}
          onDeleteRow={useCallback((id: string) => deleteInventoryItem(id), [deleteInventoryItem])}
        />
      )}

      {activeLedger && (
        <LedgerModal 
          open={ledgerOpen} 
          onOpenChange={setLedgerOpen} 
          targetId={activeLedger.id} 
          targetName={activeLedger.name} 
          type="product" 
        />
      )}
    </div>
  );
}
