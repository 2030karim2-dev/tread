import { useMemo } from 'react';
import { useAppStore } from '@/store/useAppStore';

export interface SupplierHistory {
  supplierId: string;
  supplierName: string;
  lastPrice: number;
  date: string;
  type: 'purchase' | 'quote';
  currency: string;
}

export function useProductIntelligence() {
  const purchaseInvoices = useAppStore(s => s.purchaseInvoices);
  const quotations = useAppStore(s => s.quotations);
  const suppliers = useAppStore(s => s.suppliers);

  const productSupplierHistory = useMemo(() => {
    const historyMap: Record<string, SupplierHistory[]> = {};

    // Process Purchase Invoices
    purchaseInvoices.forEach(inv => {
      inv.items.forEach(item => {
        const oem = item.oem_number?.trim();
        if (!oem) return;
        
        if (!historyMap[oem]) historyMap[oem] = [];
        
        const existing = historyMap[oem].find(h => h.supplierId === inv.supplier_id && h.type === 'purchase');
        if (!existing || new Date(inv.date) > new Date(existing.date)) {
          if (existing) {
             const idx = historyMap[oem].indexOf(existing);
             historyMap[oem].splice(idx, 1);
          }
          historyMap[oem].push({
            supplierId: inv.supplier_id,
            supplierName: inv.supplier_name,
            lastPrice: item.purchase_price,
            date: inv.date,
            type: 'purchase',
            currency: inv.currency
          });
        }
      });
    });

    // Process Quotations
    quotations.forEach(q => {
      const supplier = suppliers.find(s => s.id === q.supplier_id);
      q.items.forEach(item => {
        const oem = item.oem_number?.trim();
        if (!oem) return;
        
        if (!historyMap[oem]) historyMap[oem] = [];
        
        const existing = historyMap[oem].find(h => h.supplierId === q.supplier_id && h.type === 'quote');
        if (!existing || new Date(q.date) > new Date(existing.date)) {
          if (existing) {
             const idx = historyMap[oem].indexOf(existing);
             historyMap[oem].splice(idx, 1);
          }
          historyMap[oem].push({
            supplierId: q.supplier_id,
            supplierName: supplier?.name || 'مورد غير معروف',
            lastPrice: item.purchase_price,
            date: q.date,
            type: 'quote',
            currency: q.currency || 'USD'
          });
        }
      });
    });

    return historyMap;
  }, [purchaseInvoices, quotations, suppliers]);

  const getSuppliersForProduct = (oem: string) => {
    return productSupplierHistory[oem?.trim()] || [];
  };

  return { 
    productSupplierHistory,
    getSuppliersForProduct
  };
}
