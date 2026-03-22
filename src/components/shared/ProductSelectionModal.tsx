import { useState, useMemo } from 'react';
import { Search, CheckCircle2, Circle, Package, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EditableTable, ColumnDef } from './EditableTable';
import { Product } from '@/types';
import { useAppStore } from '@/store/useAppStore';
import { useProductIntelligence } from '@/hooks/useProductIntelligence';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatNumber } from '@/lib/helpers';

interface ProductSelectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (products: Product[]) => void;
  title?: string;
}

export function ProductSelectionModal({ open, onOpenChange, onSelect, title = "اختيار المنتجات من الكتالوج" }: ProductSelectionModalProps) {
  const products = useAppStore(s => s.products);
  const { getSuppliersForProduct } = useProductIntelligence();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.oem_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const toggleAll = () => {
    if (selectedIds.size === filteredProducts.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredProducts.map(p => p.id)));
    }
  };

  const handleConfirm = () => {
    const selected = products.filter(p => selectedIds.has(p.id));
    onSelect(selected);
    onOpenChange(false);
    setSelectedIds(new Set());
  };

  const columns: ColumnDef<Product>[] = [
    {
      key: 'id' as any,
      header: '',
      minWidth: '40px',
      render: (p) => (
        <button 
          onClick={() => toggleSelect(p.id)}
          className={`flex items-center justify-center w-full h-full transition-colors ${selectedIds.has(p.id) ? 'text-primary' : 'text-muted-foreground/30'}`}
        >
          {selectedIds.has(p.id) ? <CheckCircle2 className="w-5 h-5 fill-primary text-primary-foreground" /> : <Circle className="w-5 h-5" />}
        </button>
      )
    },
    { key: 'name', header: 'المنتج (عربي)', minWidth: '180px' },
    { key: 'oem_number', header: 'رقم OEM', minWidth: '140px', mono: true },
    { key: 'brand', header: 'العلامة', minWidth: '100px' },
    { key: 'size', header: 'المقاس', minWidth: '80px' },
    {
      key: 'suppliers' as any,
      header: 'الموردين التاريخيين',
      minWidth: '150px',
      render: (p) => {
        const history = getSuppliersForProduct(p.oem_number);
        if (history.length === 0) return <span className="text-[10px] text-muted-foreground/50 italic">لا يوجد سجل</span>;
        
        return (
          <TooltipProvider>
            <div className="flex flex-wrap gap-1">
              {history.map((h, i) => (
                <Tooltip key={`${h.supplierId}-${i}`}>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className={`text-[9px] px-1 py-0 h-4 border-primary/20 bg-primary/5 cursor-help ${h.type === 'purchase' ? 'border-green-500/30' : ''}`}>
                      {h.supplierName.substring(0, 10)}...
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs p-2">
                    <p className="font-bold">{h.supplierName}</p>
                    <p className="text-muted-foreground">{h.type === 'purchase' ? 'شراء فعلي' : 'عرض سعر'}</p>
                    <p className="text-primary font-black">{formatNumber(h.lastPrice)} {h.currency}</p>
                    <p className="text-[10px] opacity-70">{h.date}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        );
      }
    },
    { key: 'purchase_price', header: 'سعر الشراء', minWidth: '100px', type: 'number', align: 'center', render: (p) => <span className="font-bold text-primary">${p.purchase_price}</span> },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-[90vw] w-[90vw] h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Package className="w-5 h-5 text-primary-foreground" />
              </div>
              <DialogTitle className="text-xl font-extrabold">{title}</DialogTitle>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-xs font-bold text-muted-foreground">تم تحديد {selectedIds.size} منتج</span>
               <Button 
                onClick={handleConfirm} 
                disabled={selectedIds.size === 0}
                className="gradient-secondary shadow-colored-secondary text-secondary-foreground font-bold px-6"
               >
                 تأكيد الإضافة <Check className="w-4 h-4 mr-2" />
               </Button>
            </div>
          </div>
          
          <div className="relative mt-4">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="ابحث بالاسم، رقم OEM، أو العلامة التجارية..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10 h-11 rounded-xl bg-background/50 border-primary/20 focus:ring-2 ring-primary/10 transition-all font-bold"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-4 bg-muted/5">
          <div className="mb-2 flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={toggleAll} className="text-[10px] h-7 font-bold">
              {selectedIds.size === filteredProducts.length ? 'إلغاء تحديد الكل' : 'تحديد الكل الظاهر'}
            </Button>
          </div>
          <EditableTable 
            data={filteredProducts}
            columns={columns}
            virtualize={true}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
