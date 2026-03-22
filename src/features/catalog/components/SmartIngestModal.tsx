import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, CheckCircle2, AlertCircle, Plus, Copy, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/store/useAppStore';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function SmartIngestModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const products = useAppStore(s => s.products);
  const addProduct = useAppStore(s => s.addProduct);

  // Parse OEM numbers from text
  const oemNumbers = useMemo(() => {
    if (!inputText.trim()) return [];
    // Split by newlines, commas, or spaces and clean up
    return [...new Set(inputText.split(/[\n,\s]+/).map(s => s.trim().toUpperCase()).filter(s => s.length > 3))];
  }, [inputText]);

  const results = useMemo(() => {
    return oemNumbers.map(oem => {
      const match = products.find(p => 
        p.oem_number.toUpperCase() === oem || 
        (p.oem_alternatives && p.oem_alternatives.toUpperCase().includes(oem))
      );
      return { oem, match, id: oem };
    });
  }, [oemNumbers, products]);

  const foundCount = results.filter(r => r.match).length;
  const missingCount = results.length - foundCount;

  const handleIngest = async () => {
    setIsProcessing(true);
    // Simulate smart processing
    await new Promise(r => setTimeout(r, 1500));
    
    // In a real scenario, we might add missing ones to a "Draft" or similar
    // For now, we'll just notify
    toast({
        title: 'اكتمل التحليل الذكي',
        description: `تم العثور على ${foundCount} صنف، و ${missingCount} صنف غير معروف.`,
    });
    setIsProcessing(false);
  };

  const handleAddAllMissing = () => {
    results.filter(r => !r.match).forEach(r => {
        addProduct({
            name: `صنف جديد (${r.oem})`,
            name_en: '',
            name_zh: '',
            oem_number: r.oem,
            brand: '',
            size: '',
            cost_rmb: 0,
            purchase_price: 0,
            sale_price: 0,
            quantity: 0,
            notes: 'تمت إضافته عبر الاستيراد السريع',
            oem_alternatives: '',
            vehicle_compatibility: '',
            specifications: '',
        });
    });
    toast({ title: 'تمت الإضافة', description: `تمت إضافة ${missingCount} صنف جديد لقاعدة البيانات.` });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5 rounded-xl cursor-rocket h-11">
          <Zap className="w-4 h-4 text-primary" />
          الاستيراد السريع (OEM)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0 overflow-hidden rounded-3xl border-border/50 bg-card/95 backdrop-blur-xl">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-black flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Search className="w-5 h-5 text-primary" />
            </div>
            المساعد الذكي لقطع الغيار
          </DialogTitle>
          <DialogDescription className="text-right">
            قم بلصق قائمة أرقام OEM هنا وسيقوم النظام بربطها بالأسماء العربية والأسعار تلقائياً من قاعدة بياناتك.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-muted-foreground uppercase flex justify-between">
                <span>قائمة الأرقام (OEM Numbers)</span>
                <span className="text-primary">{oemNumbers.length} صنف مكتشف</span>
            </label>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="مثال:
04152-YZZA1
17801-0H050
90919-01253"
              className="w-full h-40 rounded-2xl border border-border bg-muted/50 p-4 text-sm font-mono focus:ring-2 focus:ring-primary outline-none resize-none transition-all"
            />
          </div>

          <AnimatePresence mode="wait">
            {results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold">نتائج الفحص التلقائي</h3>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">معروف: {foundCount}</span>
                        <span className="px-2 py-1 rounded-md bg-rose-500/10 text-rose-500 text-[10px] font-bold">جديد: {missingCount}</span>
                    </div>
                </div>

                <div className="border border-border rounded-2xl overflow-hidden bg-muted/30">
                    <div className="max-h-60 overflow-y-auto divide-y divide-border">
                        {results.map((res) => (
                            <div key={res.id} className="p-3 flex items-center justify-between hover:bg-primary/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${res.match ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
                                        {res.match ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <AlertCircle className="w-4 h-4 text-rose-500" />}
                                    </div>
                                    <div>
                                        <p className="text-xs font-mono font-bold">{res.oem}</p>
                                        <p className="text-[10px] text-muted-foreground">
                                            {res.match ? res.match.name : 'صنف غير معرف بعد'}
                                        </p>
                                    </div>
                                </div>
                                {res.match && (
                                    <div className="text-left">
                                        <p className="text-[10px] font-bold text-emerald-600">${res.match.purchase_price}</p>
                                        <p className="text-[9px] text-muted-foreground">{res.match.brand}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="p-6 bg-muted/50 border-t border-border flex gap-3">
            <Button 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                className="flex-1 h-12 rounded-xl font-bold"
            >
                إلغاء
            </Button>
            {missingCount > 0 ? (
                <Button 
                    onClick={handleAddAllMissing}
                    className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-bold gap-2"
                >
                    <Plus className="w-4 h-4" />
                    إضافة {missingCount} صنف جديد
                </Button>
            ) : (
                <Button 
                   onClick={handleIngest}
                   disabled={results.length === 0 || isProcessing}
                   className="flex-1 h-12 rounded-xl gradient-primary text-primary-foreground font-bold gap-2"
                >
                    {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Copy className="w-4 h-4" />}
                    بدء المعالجة الذكية
                </Button>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
