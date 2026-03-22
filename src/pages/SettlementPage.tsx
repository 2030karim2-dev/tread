import { useState, useMemo } from 'react';
import { Wallet, ArrowUpCircle, ArrowDownCircle, FileText, Receipt, Filter, Printer } from 'lucide-react';
import { PageHeader, SearchBar, LedgerModal, VoucherModal } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { useLedgers } from '@/hooks/useLedgers';
import { formatNumber } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { convertCurrency } from '@/lib/currency';

export default function SettlementPage() {
  const customers = useAppStore(s => s.customers);
  const suppliers = useAppStore(s => s.suppliers);
  const { getAllBalances } = useLedgers();
  
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'customer' | 'supplier'>('all');
  const [currencyView, setCurrencyView] = useState<'USD' | 'CNY' | 'SAR'>('USD');
  
  const [activeParty, setActiveParty] = useState<{ id: string; name: string; type: 'customer' | 'supplier' } | null>(null);
  const [isLedgerOpen, setIsLedgerOpen] = useState(false);
  const [isVoucherOpen, setIsVoucherOpen] = useState(false);
  const [voucherType, setVoucherType] = useState<'payment' | 'receipt'>('receipt');

  const balances = useMemo(() => getAllBalances(), [getAllBalances]);

  const allParties = useMemo(() => {
    const list = [
      ...customers.map(c => ({ id: c.id, name: c.name, type: 'customer' as const })),
      ...suppliers.map(s => ({ id: s.id, name: s.name, type: 'supplier' as const }))
    ];

    return list.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
        const matchesType = typeFilter === 'all' || p.type === typeFilter;
        return matchesSearch && matchesType;
    }).map(p => ({
        ...p,
        balances: balances[p.id] || {}
    }));
  }, [customers, suppliers, balances, search, typeFilter]);

  const totals = useMemo(() => {
    let receivables = 0; // Customer owes us
    let payables = 0;    // We owe supplier
    
    Object.entries(balances).forEach(([id, curBalances]) => {
        const isCustomer = customers.some(c => c.id === id);
        Object.entries(curBalances).forEach(([cur, amt]) => {
            if (typeof amt !== 'number' || isNaN(amt)) return;
            try {
                const usdVal = convertCurrency(amt, cur as any, 'USD');
                if (isCustomer) receivables += usdVal;
                else payables += usdVal;
            } catch (err) {
                console.error('Settlement calculation error:', err);
            }
        });
    });

    return { receivables, payables, net: receivables - payables };
  }, [balances, customers]);

  const openLedger = (party: any) => {
    setActiveParty(party);
    setIsLedgerOpen(true);
  };

  const openVoucher = (party: any, type: 'payment' | 'receipt') => {
    setActiveParty(party);
    setVoucherType(type);
    setIsVoucherOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="مركز التسويات والديون" 
        subtitle="راقب جميع مستحقاتك المالية وديون الموردين في شاشة واحدة."
      >
        <div className="flex gap-2">
            <Button variant="outline" className="rounded-xl gap-2 border-border/60 hover:bg-muted font-bold text-xs" onClick={() => window.print()}>
                <Printer className="w-4 h-4" /> طباعة الملخص
            </Button>
        </div>
      </PageHeader>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-3 gap-4">
        <SummaryCard 
            title="إجمالي الديون المستحقة (لنا)" 
            value={`$${formatNumber(totals.receivables)}`} 
            icon={ArrowUpCircle} 
            color="text-emerald-500" 
            bgColor="bg-emerald-500/10"
            subText="مديونيات العملاء النشطة"
        />
        <SummaryCard 
            title="إجمالي المبالغ المطلوبة (علينا)" 
            value={`$${formatNumber(totals.payables)}`} 
            icon={ArrowDownCircle} 
            color="text-rose-500" 
            bgColor="bg-rose-500/10"
            subText="مستحقات الموردين"
        />
        <SummaryCard 
            title="صافي التوازن المالي" 
            value={`$${formatNumber(totals.net)}`} 
            icon={Wallet} 
            color={totals.net >= 0 ? "text-primary" : "text-amber-500"} 
            bgColor="bg-primary/10"
            subText="إجمالي السيولة المتوقعة"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="w-full sm:w-96">
            <SearchBar 
                placeholder="ابحث عن عميل أو مورد..." 
                value={search} 
                onChange={setSearch} 
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
               <button 
                onClick={() => setTypeFilter('all')}
                className={`flex-1 sm:px-4 h-10 rounded-xl text-[10px] font-bold transition-all border ${typeFilter === 'all' ? 'bg-primary text-primary-foreground border-primary' : 'bg-card border-border hover:bg-muted'}`}
               >
                 الكل
               </button>
               <button 
                onClick={() => setTypeFilter('customer')}
                className={`flex-1 sm:px-4 h-10 rounded-xl text-[10px] font-bold transition-all border ${typeFilter === 'customer' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-card border-border hover:bg-muted'}`}
               >
                 العملاء
               </button>
               <button 
                onClick={() => setTypeFilter('supplier')}
                className={`flex-1 sm:px-4 h-10 rounded-xl text-[10px] font-bold transition-all border ${typeFilter === 'supplier' ? 'bg-rose-500 text-white border-rose-500' : 'bg-card border-border hover:bg-muted'}`}
               >
                 الموردين
               </button>
          </div>
      </div>

      <div className="bg-card rounded-3xl border border-border/50 overflow-hidden shadow-xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-muted/50 text-[10px] font-bold text-muted-foreground uppercase border-b border-border/50">
                <th className="px-6 py-4">الطرف الثاني</th>
                <th className="px-6 py-4">النوع</th>
                <th className="px-6 py-4 text-center">الرصيد (USD)</th>
                <th className="px-6 py-4 text-center">الرصيد (CNY)</th>
                <th className="px-6 py-4 text-center">الرصيد (SAR)</th>
                <th className="px-6 py-4 text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {allParties.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                        <Filter className="w-10 h-10 opacity-20" />
                        <p className="text-sm">لا توجد مديونيات تطابق بحثك حالياً.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                allParties.map(party => (
                  <tr key={party.id} className="hover:bg-primary/[0.02] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-black text-sm group-hover:text-primary transition-colors">{party.name}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold">
                        {party.type === 'customer' ? (
                            <span className="text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-lg">عميل</span>
                        ) : (
                            <span className="text-rose-500 bg-rose-500/10 px-2 py-1 rounded-lg">مورد</span>
                        )}
                    </td>
                    <td className={`px-6 py-4 text-center font-mono text-xs font-bold ${getAmountColor(party.balances.USD)}`}>
                        {party.balances.USD ? `$${formatNumber(party.balances.USD)}` : '--'}
                    </td>
                    <td className={`px-6 py-4 text-center font-mono text-xs font-bold ${getAmountColor(party.balances.CNY)}`}>
                        {party.balances.CNY ? `¥${formatNumber(party.balances.CNY)}` : '--'}
                    </td>
                    <td className={`px-6 py-4 text-center font-mono text-xs font-bold ${getAmountColor(party.balances.SAR)}`}>
                        {party.balances.SAR ? `SR ${formatNumber(party.balances.SAR)}` : '--'}
                    </td>
                    <td className="px-6 py-4 text-left">
                       <div className="flex gap-2 justify-end">
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 rounded-lg gap-1.5 text-[10px] font-bold hover:bg-primary/10 hover:text-primary"
                                onClick={() => openLedger(party)}
                            >
                                <FileText className="w-3.5 h-3.5" /> كشف حساب
                            </Button>
                            <Button 
                                size="sm" 
                                className={`h-8 rounded-lg gap-1.5 text-[10px] font-bold ${party.type === 'customer' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'} text-white shadow-md shadow-emerald-900/10`}
                                onClick={() => openVoucher(party, party.type === 'customer' ? 'receipt' : 'payment')}
                            >
                                <Receipt className="w-3.5 h-3.5" /> {party.type === 'customer' ? 'قبض' : 'دفع'}
                            </Button>
                       </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {activeParty && (
        <>
            <LedgerModal 
                open={isLedgerOpen} 
                onOpenChange={setIsLedgerOpen} 
                targetId={activeParty.id}
                targetName={activeParty.name}
                type={activeParty.type}
            />
            <VoucherModal
                open={isVoucherOpen}
                onOpenChange={setIsVoucherOpen}
                defaultPartyId={activeParty.id}
                defaultPartyName={activeParty.name}
                defaultType={voucherType}
            />
        </>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon: Icon, color, bgColor, subText }: any) {
    return (
        <div className="bg-card rounded-2xl border border-border/50 p-5 shadow-sm relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-32 h-32 ${bgColor} rounded-full -mr-16 -mt-16 blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-700`} />
            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{title}</p>
                    <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-2xl font-black mb-1">{value}</p>
                <p className="text-[10px] text-muted-foreground font-medium">{subText}</p>
            </div>
        </div>
    );
}

function getAmountColor(amount: number | undefined) {
    if (!amount) return 'text-muted-foreground opacity-30';
    if (amount > 0) return 'text-rose-500'; // We owe them (Supplier) or they owe us (Customer) -> Positive means outstanding
    return 'text-emerald-500'; // Overpaid
}
