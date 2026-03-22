import { useState, useMemo } from 'react';
import { Calculator, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatNumber } from '@/lib/helpers';

interface LandedCostCalculatorProps {
  unitCostRmb: number;
  onApply: (landedCost: number, suggestedSalePrice: number) => void;
}

export function LandedCostCalculator({ unitCostRmb, onApply }: LandedCostCalculatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // States for calculation
  const [costRmb, setCostRmb] = useState(unitCostRmb);
  const [exchangeRate, setExchangeRate] = useState(0.53); 
  const [shippingCbmRate, setShippingCbmRate] = useState(450); 
  const [itemCbm, setItemCbm] = useState(0.05); 
  const [customsPercent, setCustomsPercent] = useState(5); 
  const [otherFees, setOtherFees] = useState(0);
  const [targetMargin, setTargetMargin] = useState(25); // 25% margin

  const results = useMemo(() => {
    const baseCostInTarget = costRmb * exchangeRate;
    const shippingCostInTarget = itemCbm * shippingCbmRate;
    const customsCost = (baseCostInTarget + shippingCostInTarget) * (customsPercent / 100);
    const finalLanded = baseCostInTarget + shippingCostInTarget + customsCost + otherFees;
    
    // Suggest Sale Price based on Margin
    const suggestedSale = finalLanded / (1 - targetMargin / 100);

    return {
      baseCost: baseCostInTarget,
      shipping: shippingCostInTarget,
      customs: customsCost,
      final: finalLanded,
      suggestedSale
    };
  }, [costRmb, exchangeRate, shippingCbmRate, itemCbm, customsPercent, otherFees, targetMargin]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 hover:bg-emerald-500/10 text-emerald-600 gap-1 rounded-lg text-[10px] font-bold"
        >
            <Calculator className="w-3 h-3" />
            حسابة التكلفة
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px] rounded-3xl border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-black">
            <Wallet className="w-5 h-5 text-emerald-500" />
            حاسبة التكلفة الواصلة (Landed Cost)
          </DialogTitle>
          <DialogDescription className="text-right">
            احسب السعر النهائي للقطعة بعد إضافة الشحن والجمارك والمصاريف.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <CalcInput label="سعر المصنع (RMB)" value={costRmb} onChange={setCostRmb} />
            <CalcInput label="سعر الصرف" value={exchangeRate} onChange={setExchangeRate} />
            <CalcInput label="سعر شحن المتر (CBM)" value={shippingCbmRate} onChange={setShippingCbmRate} />
            <CalcInput label="حجم القطقة (CBM)" value={itemCbm} onChange={setItemCbm} />
            <CalcInput label="الجمارك والرسوم (%)" value={customsPercent} onChange={setCustomsPercent} />
            <CalcInput label="هامش الربح المستهدف (%)" value={targetMargin} onChange={setTargetMargin} />
            <CalcInput label="مصاريف أخرى (للواحدة)" value={otherFees} onChange={setOtherFees} />
          </div>

          <div className="p-5 rounded-2xl bg-muted/50 border border-border/50 space-y-3">
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>سعر المنتج الأصلي</span>
                  <span>{formatNumber(results.baseCost)}</span>
              </div>
              <div className="flex justify-between text-xs font-bold text-muted-foreground">
                  <span>تكلفة الشحن والجمارك</span>
                  <span>{formatNumber(results.shipping + results.customs)}</span>
              </div>
              <div className="h-px bg-border/50 my-1" />
              <div className="flex justify-between items-center text-emerald-600">
                  <span className="text-sm font-black">التكلفة الواصلة النهائية</span>
                  <span className="text-xl font-black">{formatNumber(results.final)}</span>
              </div>
              <div className="flex justify-between items-center text-primary pt-2 border-t border-primary/10">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-black uppercase block">سعر البيع المقترح</span>
                    <span className="text-[9px] text-muted-foreground">بناءً على ربح {targetMargin}%</span>
                  </div>
                  <span className="text-xl font-black italic">{formatNumber(results.suggestedSale)}</span>
              </div>
          </div>
        </div>

        <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl" onClick={() => setIsOpen(false)}>إلغاء</Button>
            <Button 
                onClick={() => {
                    onApply(results.final, results.suggestedSale);
                    setIsOpen(false);
                }}
                className="flex-1 h-11 rounded-xl gradient-primary text-primary-foreground font-bold gap-2"
            >
                تطبيق الأسعار المقترحة
            </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CalcInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
    return (
        <div className="space-y-1">
            <label className="text-[10px] font-black text-muted-foreground uppercase">{label}</label>
            <Input 
                type="number" 
                value={value} 
                onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                className="h-10 rounded-xl bg-muted/30 border-border/50 font-mono text-sm"
            />
        </div>
    );
}
