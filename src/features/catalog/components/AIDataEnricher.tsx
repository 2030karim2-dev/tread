import { useState } from 'react';
import { Sparkles, Loader2, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface AIDataEnricherProps {
  initialName: string;
  oemNumber?: string;
  oemAlternatives?: string;
  onSuggest: (suggestions: { name_en: string; name_zh: string; specs?: string }) => void;
}

export function AIDataEnricher({ initialName, oemNumber, oemAlternatives, onSuggest }: AIDataEnricherProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<{ name_en: string; name_zh: string; specs: string } | null>(null);

  const handleEnrich = async () => {
    if (!initialName) {
        toast({ title: 'خطأ', description: 'يرجى إدخال اسم المنتج أولاً', variant: 'destructive' });
        return;
    }

    setIsAnalyzing(true);
    await new Promise(r => setTimeout(r, 2000));

    // Priority based logic: OEM > Alternative > Name
    const lookupString = (oemNumber || oemAlternatives || initialName || '').toLowerCase();
    const isGenericInput = lookupString.length < 3;
    
    let mockEn = '';
    let mockZh = '';
    let mockSpecs = '';
    let isConfident = false;

    // Simulated OEM database matches
    if (lookupString.includes('55810') || lookupString.includes('brake') || lookupString.includes('سفايف')) {
        mockEn = 'Brake Pads Set (Premium)';
        mockZh = '优质刹车片套装';
        mockSpecs = 'Ceramic composite, OEM Quality Standards';
        isConfident = true;
    } else if (lookupString.includes('15601') || lookupString.includes('filter') || lookupString.includes('فلتر')) {
        mockEn = 'Oil Filter Assembly';
        mockZh = '机油濾清器总成';
        mockSpecs = 'High-flow synthetic media, Check valve included';
        isConfident = true;
    } else if (lookupString.includes('48510') || lookupString.includes('shock') || lookupString.includes('مساعد')) {
        mockEn = 'Strut & Shock Absorber';
        mockZh = '减震器总成';
        mockSpecs = 'Nitro-gas charged, ISO 9001 certified';
        isConfident = true;
    } else if (lookupString.includes('90919') || lookupString.includes('spark') || lookupString.includes('بواجي')) {
        mockEn = 'Iridium Spark Plug (High Perf)';
        mockZh = '高性能铱金火花塞';
        mockSpecs = '0.6mm Iridium tip, Trivalent metal plating';
        isConfident = true;
    }

    if (!isConfident || isGenericInput) {
        setSuggestions(null);
        toast({ 
            title: 'تحذير البيانات', 
            description: 'لم يتم العثور على تطابق دقيق وموثوق. يرجى إدخال البيانات يدوياً لتجنب الأخطاء.',
            variant: 'destructive'
        });
    } else {
        setSuggestions({ name_en: mockEn, name_zh: mockZh, specs: mockSpecs });
    }
    setIsAnalyzing(false);
  };

  const applySuggestions = () => {
    if (suggestions) {
        onSuggest(suggestions);
        setSuggestions(null);
        toast({ title: 'تم التحديث', description: 'تم تطبيق اقتراحات الذكاء الاصطناعي بنجاح' });
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!suggestions ? (
        <Button 
          variant="outline" 
          size="sm"
          disabled={isAnalyzing}
          onClick={handleEnrich}
          className="gap-2 border-primary/20 hover:bg-primary/5 rounded-xl h-9 text-[10px] font-bold"
        >
          {isAnalyzing ? <Loader2 className="w-3 h-3 animate-spin text-primary" /> : <Sparkles className="w-3 h-3 text-primary" />}
          {isAnalyzing ? 'جاري تحليل البيانات...' : 'اقتراح الذكاء الاصطناعي'}
        </Button>
      ) : (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-3 bg-primary/5 border border-primary/20 rounded-xl space-y-2"
        >
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-primary flex items-center gap-1">
                    <Check className="w-3 h-3" /> اقتراحات جاهزة
                </span>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setSuggestions(null)}>
                    <AlertCircle className="w-3 h-3 text-muted-foreground" />
                </Button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
                <div className="space-y-1">
                    <p className="text-muted-foreground">English:</p>
                    <p className="font-bold">{suggestions.name_en}</p>
                </div>
                <div className="space-y-1">
                    <p className="text-muted-foreground">Chinese:</p>
                    <p className="font-bold">{suggestions.name_zh}</p>
                </div>
            </div>
            <Button 
                onClick={applySuggestions}
                variant="ghost" 
                className="w-full h-7 rounded-lg bg-primary text-primary-foreground text-[10px] font-bold hover:bg-primary/90"
            >
                تطبيق الكل
            </Button>
        </motion.div>
      )}
    </div>
  );
}
