import { useAppStore } from '@/store/useAppStore';

export interface LedgerEntry {
  date: string;
  description: string;
  debit: number;  // المبلغ المستحق (فاتورة)
  credit: number; // المبلغ المدفوع
  balance: number;
  currency: string;
  referenceId: string;
}

export interface MovementEntry {
  date: string;
  type: 'in' | 'out' | 'adj';
  description: string;
  quantity: number;
  price: number;
  balance: number;
  partyName: string;
  referenceId: string;
}

export function useLedgers() {
  const purchaseInvoices = useAppStore(s => s.purchaseInvoices);
  const salesInvoices = useAppStore(s => s.salesInvoices);
  const vouchers = useAppStore(s => s.vouchers);

  const getPartyLedger = (partyId: string, type: 'supplier' | 'customer') => {
    const entries: LedgerEntry[] = [];
    
    if (type === 'supplier') {
      purchaseInvoices.filter(inv => inv.supplier_id === partyId).forEach(inv => {
        const total = inv.items.reduce((s, i) => s + i.quantity * i.purchase_price, 0);
        
        // Invoice Entry (Debit: We owe the supplier)
        entries.push({
          date: inv.date,
          description: `فاتورة مشتريات #${inv.number}`,
          debit: total,
          credit: 0,
          balance: 0,
          currency: inv.currency,
          referenceId: inv.id
        });
        
        // Payment Entry (Credit: We paid the supplier)
        if (inv.amount_paid > 0) {
          entries.push({
            date: inv.date,
            description: `دفع نقدًا - فاتورة #${inv.number}`,
            debit: 0,
            credit: inv.amount_paid,
            balance: 0,
            currency: inv.currency,
            referenceId: inv.id
          });
        }
      });
    } else {
      salesInvoices.filter(inv => inv.customer_id === partyId).forEach(inv => {
        const total = inv.items.reduce((s, i) => s + i.quantity * i.sale_price, 0);
        
        // Invoice Entry (Debit: Customer owes us)
        entries.push({
          date: inv.date,
          description: `فاتورة مبيعات #${inv.number}`,
          debit: total,
          credit: 0,
          balance: 0,
          currency: inv.currency,
          referenceId: inv.id
        });
        
        // Payment Entry (Credit: Customer paid us)
        if (inv.amount_paid > 0) {
          entries.push({
            date: inv.date,
            description: `قبض نقدًا - فاتورة #${inv.number}`,
            debit: 0,
            credit: inv.amount_paid,
            balance: 0,
            currency: inv.currency,
            referenceId: inv.id
          });
        }
      });
    }

    // Add standalone Vouchers
    vouchers.filter(v => v.party_id === partyId).forEach(v => {
      entries.push({
        date: v.date,
        description: `${v.type === 'payment' ? 'سند دفع' : 'سند قبض'} #${v.number}${v.notes ? ` - ${v.notes}` : ''}`,
        debit: 0,
        credit: v.amount,
        balance: 0,
        currency: v.currency,
        referenceId: v.id
      });
    });

    // Sort chronologically
    entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningBalance = 0;
    return entries.map(e => {
      runningBalance += (e.debit - e.credit);
      return { ...e, balance: runningBalance };
    });
  };

  const getProductMovement = (oem: string) => {
    const movements: MovementEntry[] = [];
    if (!oem) return [];

    // Process Purchases (IN)
    purchaseInvoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.oem_number === oem) {
          movements.push({
            date: inv.date,
            type: 'in',
            description: `شراء - ف. ${inv.number}`,
            quantity: item.quantity,
            price: item.purchase_price,
            balance: 0,
            partyName: inv.supplier_name,
            referenceId: inv.id
          });
        }
      });
    });

    // Process Sales (OUT)
    salesInvoices.forEach(inv => {
      inv.items.forEach(item => {
        if (item.oem_number === oem) {
          movements.push({
            date: inv.date,
            type: 'out',
            description: `بيع - ف. ${inv.number}`,
            quantity: -item.quantity,
            price: item.sale_price,
            balance: 0,
            partyName: inv.customer_name,
            referenceId: inv.id
          });
        }
      });
    });

    // Sort chronologically
    movements.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    
    let runningQty = 0;
    return movements.map(m => {
      runningQty += m.quantity;
      return { ...m, balance: runningQty };
    });
  };

  const getAllBalances = () => {
    const balances: Record<string, Record<string, number>> = {};
    
    // Process Purchase Invoices (Suppliers)
    purchaseInvoices.forEach(inv => {
        if (!inv.supplier_id || !inv.currency) return;
        const total = inv.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.purchase_price) || 0), 0);
        if (!balances[inv.supplier_id]) balances[inv.supplier_id] = {};
        const partyBalances = balances[inv.supplier_id]!;
        const invTotal = total - (Number(inv.amount_paid) || 0);
        partyBalances[inv.currency] = (partyBalances[inv.currency] || 0) + invTotal;
    });

    // Process Sales Invoices (Customers)
    salesInvoices.forEach(inv => {
        if (!inv.customer_id || !inv.currency) return;
        const total = inv.items.reduce((s, i) => s + (Number(i.quantity) || 0) * (Number(i.sale_price) || 0), 0);
        if (!balances[inv.customer_id]) balances[inv.customer_id] = {};
        const partyBalances = balances[inv.customer_id]!;
        const invTotal = total - (Number(inv.amount_paid) || 0);
        partyBalances[inv.currency] = (partyBalances[inv.currency] || 0) + invTotal;
    });

    // Process Vouchers (Standalone)
    vouchers.forEach(v => {
        if (!v.party_id || !v.currency) return;
        if (!balances[v.party_id]) balances[v.party_id] = {};
        const partyBalances = balances[v.party_id]!;
        // Vouchers reduce the balance (credit)
        partyBalances[v.currency] = (partyBalances[v.currency] || 0) - (Number(v.amount) || 0);
    });

    return balances;
  };

  return { getPartyLedger, getProductMovement, getAllBalances };
}
