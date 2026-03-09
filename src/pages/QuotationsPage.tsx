import { useState } from 'react';
import { motion } from 'framer-motion';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeftRight, Star } from 'lucide-react';

const mockQuotations = [
  {
    id: '1', supplier_name: 'وانغ لي - Guangzhou Auto Parts', date: '2025-01-12',
    items: [
      { product: 'فلتر زيت تويوتا', oem: '04152-YZZA1', qty: 500, price: 8 },
      { product: 'فلتر هواء كامري', oem: '17801-0H050', qty: 300, price: 12 },
      { product: 'تيل فرامل أمامي', oem: '04465-33471', qty: 200, price: 18 },
    ],
  },
  {
    id: '2', supplier_name: 'ليو هوا - Shanghai Brake Systems', date: '2025-01-14',
    items: [
      { product: 'فلتر زيت تويوتا', oem: '04152-YZZA1', qty: 500, price: 9.5 },
      { product: 'فلتر هواء كامري', oem: '17801-0H050', qty: 300, price: 11 },
      { product: 'تيل فرامل أمامي', oem: '04465-33471', qty: 200, price: 19 },
    ],
  },
];

export default function QuotationsPage() {
  const [comparing, setComparing] = useState(false);

  // Calculate supplier totals
  const supplierTotals = mockQuotations.map(q =>
    q.items.reduce((s, it) => s + it.qty * it.price, 0)
  );

  return (
    <div className="space-y-4">
      <PageHeader title="عروض الأسعار">
        <Button onClick={() => setComparing(!comparing)} variant={comparing ? 'default' : 'outline'} className="gap-2">
          <ArrowLeftRight className="w-4 h-4" /> {comparing ? 'إنهاء المقارنة' : 'مقارنة العروض'}
        </Button>
      </PageHeader>

      {comparing ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card rounded-xl border border-border shadow-sm overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr>
                <th className="spreadsheet-header">المنتج</th>
                <th className="spreadsheet-header">OEM</th>
                <th className="spreadsheet-header text-center">الكمية</th>
                {mockQuotations.map(q => (
                  <th key={q.id} className="spreadsheet-header text-center">{q.supplier_name.split(' - ')[0]}</th>
                ))}
                <th className="spreadsheet-header text-center">الفرق</th>
              </tr>
            </thead>
            <tbody>
              {mockQuotations[0].items.map((item, i) => {
                const prices = mockQuotations.map(q => q.items[i]?.price || 0);
                const minPrice = Math.min(...prices);
                const maxPrice = Math.max(...prices);
                const diff = maxPrice - minPrice;
                const diffPct = minPrice > 0 ? ((diff / minPrice) * 100).toFixed(1) : '0';

                return (
                  <tr key={i} className="hover:bg-muted/30">
                    <td className="spreadsheet-cell text-sm font-medium">{item.product}</td>
                    <td className="spreadsheet-cell text-sm font-mono">{item.oem}</td>
                    <td className="spreadsheet-cell text-center text-sm">{item.qty}</td>
                    {prices.map((p, j) => {
                      const isBest = p === minPrice && minPrice !== maxPrice;
                      const isWorst = p === maxPrice && minPrice !== maxPrice;
                      return (
                        <td key={j} className={`spreadsheet-cell text-center text-sm font-bold ${
                          isBest ? 'bg-accent/15 text-accent' : isWorst ? 'bg-destructive/10 text-destructive' : ''
                        }`}>
                          <span className="inline-flex items-center gap-1">
                            {isBest && <Star className="w-3 h-3 fill-current" />}
                            ¥{p}
                          </span>
                        </td>
                      );
                    })}
                    <td className="spreadsheet-cell text-center text-sm">
                      <span className="text-destructive font-semibold">¥{diff.toFixed(1)}</span>
                      <span className="text-muted-foreground text-xs mr-1">({diffPct}%)</span>
                    </td>
                  </tr>
                );
              })}
              {/* Totals row */}
              <tr className="bg-muted/50 font-bold border-t-2 border-border">
                <td colSpan={3} className="spreadsheet-cell text-sm">الإجمالي</td>
                {supplierTotals.map((total, j) => {
                  const minTotal = Math.min(...supplierTotals);
                  const isBest = total === minTotal && supplierTotals.length > 1;
                  return (
                    <td key={j} className={`spreadsheet-cell text-center text-sm ${isBest ? 'text-accent' : ''}`}>
                      <span className="inline-flex items-center gap-1">
                        {isBest && <Star className="w-3 h-3 fill-current" />}
                        ¥{total.toLocaleString()}
                      </span>
                    </td>
                  );
                })}
                <td className="spreadsheet-cell text-center text-sm text-destructive">
                  ¥{(Math.max(...supplierTotals) - Math.min(...supplierTotals)).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {mockQuotations.map((q, i) => (
            <motion.div key={q.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg gradient-primary"><FileText className="w-4 h-4 text-primary-foreground" /></div>
                <div>
                  <h4 className="font-bold text-sm">{q.supplier_name}</h4>
                  <p className="text-xs text-muted-foreground">{q.date}</p>
                </div>
              </div>
              <div className="space-y-2">
                {q.items.map((item, j) => (
                  <div key={j} className="flex justify-between items-center p-2 bg-muted/50 rounded-lg text-sm">
                    <div>
                      <p className="font-medium">{item.product}</p>
                      <p className="text-xs text-muted-foreground">{item.qty} قطعة</p>
                    </div>
                    <span className="font-bold">¥{item.price}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-border text-sm font-bold flex justify-between">
                <span>الإجمالي:</span>
                <span>¥{q.items.reduce((s, it) => s + it.qty * it.price, 0).toLocaleString()}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
