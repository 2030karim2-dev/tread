import { useState, useMemo } from 'react';
import { FileBarChart, Printer, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { exportToExcel, exportToPDF } from '@/lib/export';
import { formatNumber } from '@/lib/helpers';
import { toast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function ReportGenerator() {
  const trips = useAppStore(s => s.trips);
  const expenses = useAppStore(s => s.expenses);
  const purchaseInvoices = useAppStore(s => s.purchaseInvoices);
  const suppliers = useAppStore(s => s.suppliers);

  const [selectedTripId, setSelectedTripId] = useState<string | 'all'>('all');
  const [includeSections, setIncludeSections] = useState({
    expenses: true,
    purchases: true,
    suppliers: true
  });

  const selectedTrip = useMemo(() => 
    selectedTripId === 'all' ? null : trips.find(t => t.id === selectedTripId)
  , [selectedTripId, trips]);

  const filteredData = useMemo(() => {
    const tripExpenses = expenses.filter(e => selectedTripId === 'all' || e.trip_id === selectedTripId);
    const tripPurchases = purchaseInvoices.filter(p => {
        if (selectedTripId === 'all') return true;
        // Purchase invoices are linked to suppliers, and suppliers are linked to trips
        const supplier = suppliers.find(s => s.id === p.supplier_id);
        return supplier?.trip_id === selectedTripId;
    });
    const tripSuppliers = suppliers.filter(s => selectedTripId === 'all' || s.trip_id === selectedTripId);

    return {
      expenses: tripExpenses,
      purchases: tripPurchases,
      suppliers: tripSuppliers
    };
  }, [selectedTripId, expenses, purchaseInvoices, suppliers]);

  const stats = useMemo(() => {
    const totalExpensesUSD = filteredData.expenses.reduce((acc, e) => {
        // Simplified USD conversion for report preview
        if (e.currency === 'USD') return acc + e.amount;
        if (e.currency === 'CNY') return acc + (e.amount / 7);
        return acc + (e.amount / 3.75);
    }, 0);

    const totalPurchasesUSD = filteredData.purchases.reduce((acc, p) => 
        acc + p.items.reduce((sum, item) => sum + (item.quantity * item.purchase_price), 0), 0
    );

    return {
      totalExpensesUSD,
      totalPurchasesUSD,
      itemCount: filteredData.purchases.reduce((acc, p) => acc + p.items.length, 0),
      supplierCount: filteredData.suppliers.length
    };
  }, [filteredData]);

  const generateReport = (type: 'excel' | 'pdf') => {
    const tripName = selectedTrip?.name || 'جميع_البيانات';
    const filename = `تقرير_الرحلة_${tripName}_${new Date().toISOString().split('T')[0]}`;

    try {
        if (type === 'excel') {
            // In a real scenario we'd use a multi-sheet export, 
            // but for now we'll combine the most important summaries.
            const summaryData = [
                { category: 'إجمالي المصروفات', detail: `$${formatNumber(stats.totalExpensesUSD)}` },
                { category: 'إجمالي المشتريات', detail: `$${formatNumber(stats.totalPurchasesUSD)}` },
                { category: 'عدد الموردين', detail: stats.supplierCount },
                { category: 'عدد الأصناف', detail: stats.itemCount },
            ];
            exportToExcel(summaryData, [
                { key: 'category', header: 'الفئة' },
                { key: 'detail', header: 'التفاصيل' }
            ], filename);
        } else {
            exportToPDF(
                filteredData.expenses.map(e => ({ ...e, amount_formatted: `$${formatNumber(e.amount)}` })),
                [
                    { key: 'date', header: 'التاريخ' },
                    { key: 'category', header: 'النوع' },
                    { key: 'notes', header: 'البيان' },
                    { key: 'amount_formatted', header: 'المبلغ' }
                ],
                filename,
                `تقرير مالي - ${tripName}`
            );
        }

        toast({
            title: 'تم إنشاء التقرير',
            description: `تم تصدير التقرير بصيغة ${type.toUpperCase()}`,
        });
    } catch (error) {
        toast({
            title: 'خطأ',
            description: 'فشل إنشاء التقرير المجمع',
            variant: 'destructive'
        });
    }
  };

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-xl font-black flex items-center gap-2">
          <FileBarChart className="w-5 h-5 text-primary" />
          مركز التقارير الذكي
        </CardTitle>
        <CardDescription>قم بتجميع بيانات رحلاتك في تقارير احترافية وشاملة.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        {/* Selection Area */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">اختر الرحلة</label>
            <select 
              value={selectedTripId} 
              onChange={(e) => setSelectedTripId(e.target.value)}
              className="w-full h-11 rounded-xl border border-border bg-card px-4 text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
            >
              <option value="all">كل الرحلات (تجميعي)</option>
              {trips.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase">أقسام التقرير</label>
            <div className="flex gap-2">
              {(['expenses', 'purchases', 'suppliers'] as const).map(section => (
                <button
                  key={section}
                  onClick={() => setIncludeSections(prev => ({ ...prev, [section]: !prev[section] }))}
                  className={`flex-1 h-11 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1 ${
                    includeSections[section] 
                    ? 'bg-primary/10 border-primary text-primary' 
                    : 'bg-muted/50 border-border text-muted-foreground'
                  }`}
                >
                  {includeSections[section] && <CheckCircle2 className="w-3 h-3" />}
                  {section === 'expenses' ? 'المصاريف' : section === 'purchases' ? 'المشتريات' : 'الموردين'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatMini label="إجمالي المصاريف" value={`$${formatNumber(stats.totalExpensesUSD)}`} color="bg-rose-500" />
          <StatMini label="إجمالي المشتريات" value={`$${formatNumber(stats.totalPurchasesUSD)}`} color="bg-emerald-500" />
          <StatMini label="عدد الموردين" value={stats.supplierCount.toString()} color="bg-blue-500" />
          <StatMini label="إجمالي السلع" value={stats.itemCount.toString()} color="bg-amber-500" />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border/50">
          <Button 
            onClick={() => generateReport('pdf')}
            className="flex-1 h-14 bg-rose-600 hover:bg-rose-700 text-white font-bold gap-3 rounded-2xl shadow-lg shadow-rose-900/20 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Printer className="w-4 h-4" />
            </div>
            <div className="text-right">
                <p className="text-[10px] opacity-80 leading-none mb-1">تصدير جاهز للطباعة</p>
                <p className="text-sm">تحميل ملف PDF</p>
            </div>
          </Button>

          <Button 
            onClick={() => generateReport('excel')}
            className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-3 rounded-2xl shadow-lg shadow-emerald-900/20 group"
          >
            <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="text-right">
                <p className="text-[10px] opacity-80 leading-none mb-1">تصدير للبيانات الرقمية</p>
                <p className="text-sm">تحميل ملف Excel</p>
            </div>
          </Button>
        </div>

        <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground leading-relaxed">
                <strong>نصيحة الوكيل:</strong> التقارير المجمعة تساعدك في تسوية الحسابات المالية مع شركائك في اليمن بسرعة ودقة عالية. تأكد من إرفاق ملف PDF عند إرسال كشوفات الحساب.
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatMini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-card border border-border p-3 rounded-xl shadow-sm">
      <div className="flex items-center gap-2 mb-1">
        <div className={`w-1.5 h-1.5 rounded-full ${color}`} />
        <span className="text-[10px] font-bold text-muted-foreground uppercase truncate">{label}</span>
      </div>
      <p className="text-sm font-black truncate">{value}</p>
    </div>
  );
}
