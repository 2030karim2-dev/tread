import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EditableTable, ColumnDef } from './EditableTable';
import { useLedgers, LedgerEntry, MovementEntry } from '@/hooks/useLedgers';
import { useAppStore } from '@/store/useAppStore';
import { formatNumber } from '@/lib/helpers';
import { FileText, ArrowUpRight, ArrowDownLeft, Clock, Package, User, Building, Printer } from 'lucide-react';
import { exportToPDF } from '@/lib/export';
import { Button } from '@/components/ui/button';

interface LedgerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetId: string;
  targetName: string;
  type: 'supplier' | 'customer' | 'product';
}

export function LedgerModal({ open, onOpenChange, targetId, targetName, type }: LedgerModalProps) {
  const { getPartyLedger, getProductMovement } = useLedgers();
  const companySettings = useAppStore(s => s.companySettings);
  const [currencyFilter, setCurrencyFilter] = useState('all');

  const data = useMemo(() => {
    if (!open || !targetId) return [];
    if (type === 'product') return getProductMovement(targetId);
    return getPartyLedger(targetId, type);
  }, [open, targetId, type, getPartyLedger, getProductMovement]);

  const filteredData = useMemo(() => {
    if (type === 'product') return data;
    if (currencyFilter === 'all') return data;
    return (data as LedgerEntry[]).filter(e => e.currency === currencyFilter);
  }, [data, type, currencyFilter]);

  const currencies = useMemo(() => {
    if (type === 'product') return [];
    return [...new Set((data as LedgerEntry[]).map(e => e.currency))];
  }, [data, type]);

  const partyColumns: ColumnDef<LedgerEntry>[] = [
    { key: 'date', header: 'التاريخ', minWidth: '100px' },
    { key: 'description', header: 'البيان', minWidth: '200px' },
    { 
      key: 'debit', header: 'مدين (عليه)', minWidth: '100px', align: 'center',
      render: (row) => row.debit > 0 ? <span className="text-rose-500 font-bold">{formatNumber(row.debit)}</span> : '-'
    },
    { 
      key: 'credit', header: 'دائن (له)', minWidth: '100px', align: 'center',
      render: (row) => row.credit > 0 ? <span className="text-emerald-500 font-bold">{formatNumber(row.credit)}</span> : '-'
    },
    { 
      key: 'balance', header: 'الرصيد', minWidth: '120px', align: 'center',
      render: (row) => (
        <span className={`font-black ${row.balance > 0 ? 'text-rose-600' : row.balance < 0 ? 'text-emerald-600' : 'text-muted-foreground'}`}>
          {formatNumber(Math.abs(row.balance))} {row.currency}
          <span className="text-[10px] mr-1 opacity-70">{row.balance > 0 ? '(مدين)' : row.balance < 0 ? '(دائن)' : ''}</span>
        </span>
      )
    },
  ];

  const productColumns: ColumnDef<MovementEntry>[] = [
    { key: 'date', header: 'التاريخ', minWidth: '100px' },
    { 
      key: 'type', header: 'النوع', minWidth: '80px', align: 'center',
      render: (row) => (
        <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${row.type === 'in' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
          {row.type === 'in' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownLeft className="w-3 h-3" />}
          {row.type === 'in' ? 'دخول' : 'خروج'}
        </span>
      )
    },
    { key: 'description', header: 'الحركة', minWidth: '150px' },
    { key: 'partyName', header: 'الطرف الثاني', minWidth: '150px' },
    { 
      key: 'quantity', header: 'الكمية', minWidth: '80px', align: 'center',
      render: (row) => <span className={`font-bold ${row.quantity > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{row.quantity > 0 ? `+${row.quantity}` : row.quantity}</span>
    },
    { 
        key: 'balance', header: 'الرصيد المتبقي', minWidth: '100px', align: 'center',
        render: (row) => <span className="font-black text-primary">{row.balance}</span>
    },
  ];

  const handleExport = () => {
    const filename = `كشف_حساب_${targetName}_${new Date().toISOString().split('T')[0]}`;
    const columns = type === 'product' ? productColumns : partyColumns;
    
    // Simple mapping for PDF export
    const exportData = filteredData.map((row: any) => {
        const entry: any = { ...row };
        if (type !== 'product') {
            entry.debit = row.debit > 0 ? formatNumber(row.debit) : '-';
            entry.credit = row.credit > 0 ? formatNumber(row.credit) : '-';
            entry.balance = `${formatNumber(Math.abs(row.balance))} ${row.currency}`;
        }
        return entry;
    });

    exportToPDF(
      exportData,
      columns.map(c => ({ key: c.key as string, header: c.header })),
      filename,
      type === 'product' ? `سجل حركة: ${targetName}` : `كشف حساب: ${targetName}`,
      {
        companyName: companySettings.name,
        subTitle: type === 'product' ? 'تقرير حركة المخزون' : `كشف معاملات مالي تفصيلي - ${currencyFilter === 'all' ? 'جميع العملات' : currencyFilter}`,
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent dir="rtl" className="max-w-[95vw] sm:max-w-[80vw] h-[85vh] flex flex-col p-0 overflow-hidden border-border/50 shadow-2xl">
        <DialogHeader className="p-6 border-b border-border/50 bg-muted/20">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${type === 'product' ? 'gradient-primary' : 'gradient-secondary'}`}>
                {type === 'product' ? <Package className="w-6 h-6 text-primary-foreground" /> : type === 'supplier' ? <Building className="w-6 h-6 text-secondary-foreground" /> : <User className="w-6 h-6 text-secondary-foreground" />}
              </div>
              <div>
                <DialogTitle className="text-xl font-black">{type === 'product' ? 'سجل حركة المنتج' : 'كشف حساب تفصيلي'}</DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground font-bold flex items-center gap-1 mt-1">
                    <FileText className="w-3.5 h-3.5" />
                    {targetName}
                </DialogDescription>
              </div>
            </div>

            {type !== 'product' && currencies.length > 1 && (
                <div className="flex items-center gap-2 bg-background/50 p-1 rounded-xl border border-border/50">
                    <button 
                        onClick={() => setCurrencyFilter('all')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currencyFilter === 'all' ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
                    >الكل</button>
                    {currencies.map(c => (
                        <button 
                            key={c}
                            onClick={() => setCurrencyFilter(c)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${currencyFilter === c ? 'bg-primary text-primary-foreground shadow-sm' : 'hover:bg-muted'}`}
                        >{c}</button>
                    ))}
                </div>
            )}

            <Button 
                variant="outline" 
                className="rounded-xl gap-2 font-bold text-xs border-border/60 hover:bg-primary/5 hover:text-primary"
                onClick={handleExport}
            >
                <Printer className="w-4 h-4" /> تصدير PDF
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden p-6 bg-muted/5 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-[10px] font-black flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    إجمالي العمليات: {filteredData.length}
                </div>
            </div>
            
            <div className="flex-1 border border-border/50 rounded-2xl overflow-hidden bg-card/30">
                <EditableTable 
                    data={filteredData as any}
                    columns={type === 'product' ? (productColumns as any) : (partyColumns as any)}
                    virtualize={true}
                />
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
