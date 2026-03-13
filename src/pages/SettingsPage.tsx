import { motion } from 'framer-motion';
import { Save, Building2, RefreshCw, Palette, ShoppingBag } from 'lucide-react';
import { PageHeader } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useThemeStore } from '@/store/useThemeStore';
import { useAppModeStore } from '@/store/useAppModeStore';
import { useAppStore } from '@/store/useAppStore';
import { Switch } from '@/components/ui/switch';
import { Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { toast } = useToast();
  const { isDark, toggle } = useThemeStore();
  const { isMarketMode, toggleMarketMode } = useAppModeStore();

  // Read from store (persisted)
  const companySettings = useAppStore(s => s.companySettings);
  const currencyRates = useAppStore(s => s.currencyRates);
  const updateCompanySettings = useAppStore(s => s.updateCompanySettings);
  const updateCurrencyRates = useAppStore(s => s.updateCurrencyRates);

  const handleCompanyChange = (key: string, value: string) => {
    updateCompanySettings({ [key]: value });
  };

  const handleRateChange = (key: string, value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      updateCurrencyRates({ [key]: numValue });
    }
  };

  const saveCompany = () => {
    toast({ title: 'تم الحفظ', description: 'تم حفظ معلومات الشركة بنجاح' });
  };

  const saveRates = () => {
    toast({ title: 'تم الحفظ', description: 'تم تحديث أسعار الصرف بنجاح — ستنعكس التغييرات فوراً في محول العملات' });
  };

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      <PageHeader title="الإعدادات" />

      <Tabs defaultValue="company" className="space-y-3 sm:space-y-4 lg:space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="company" className="gap-2"><Building2 className="w-4 h-4" /> الشركة</TabsTrigger>
          <TabsTrigger value="currency" className="gap-2"><RefreshCw className="w-4 h-4" /> العملات</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="w-4 h-4" /> المظهر</TabsTrigger>
          <TabsTrigger value="market" className="gap-2"><ShoppingBag className="w-4 h-4" /> السوق</TabsTrigger>
        </TabsList>

        {/* Company Info */}
        <TabsContent value="company">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-2xl">
            <h3 className="font-bold text-lg">معلومات الشركة</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['name', 'اسم الشركة'],
                ['owner', 'المالك / المدير'],
                ['phone', 'رقم الهاتف'],
                ['email', 'البريد الإلكتروني'],
                ['taxNumber', 'الرقم الضريبي'],
              ] as const).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
                  <Input value={companySettings[key]} onChange={e => handleCompanyChange(key, e.target.value)} />
                </div>
              ))}
              <div className="sm:col-span-2 space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground">العنوان</Label>
                <Input value={companySettings.address} onChange={e => handleCompanyChange('address', e.target.value)} />
              </div>
            </div>
            <Button onClick={saveCompany} className="gradient-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> حفظ
            </Button>
          </motion.div>
        </TabsContent>

        {/* Currency Rates */}
        <TabsContent value="currency">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-2xl">
            <h3 className="font-bold text-lg">أسعار الصرف</h3>
            <p className="text-xs text-muted-foreground">أدخل أسعار الصرف المستخدمة في حسابات النظام — التغييرات تنعكس فوراً</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {([
                ['CNY_USD', 'يوان → دولار'],
                ['CNY_SAR', 'يوان → ريال'],
                ['USD_CNY', 'دولار → يوان'],
                ['USD_SAR', 'دولار → ريال'],
                ['SAR_CNY', 'ريال → يوان'],
                ['SAR_USD', 'ريال → دولار'],
              ] as const).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={currencyRates[key]}
                    onChange={e => handleRateChange(key, e.target.value)}
                    className="font-mono"
                  />
                </div>
              ))}
            </div>
            <Button onClick={saveRates} className="gradient-primary text-primary-foreground gap-2">
              <Save className="w-4 h-4" /> حفظ الأسعار
            </Button>
          </motion.div>
        </TabsContent>

        {/* Appearance */}
        <TabsContent value="appearance">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-md">
            <h3 className="font-bold text-lg">المظهر</h3>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-secondary" />}
                <div>
                  <p className="font-semibold text-sm">{isDark ? 'الوضع المظلم' : 'الوضع الفاتح'}</p>
                  <p className="text-xs text-muted-foreground">تبديل مظهر التطبيق</p>
                </div>
              </div>
              <Switch checked={isDark} onCheckedChange={toggle} />
            </div>
          </motion.div>
        </TabsContent>

        {/* Market Mode */}
        <TabsContent value="market">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 space-y-5 max-w-md">
            <h3 className="font-bold text-lg">وضع السوق</h3>
            <p className="text-sm text-muted-foreground">وضع مخصص للتعامل في الأسواق المزدحمة بأزرار كبيرة وواضحة</p>

            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50 border border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-semibold text-sm">وضع السوق</p>
                  <p className="text-xs text-muted-foreground">أزرار كبيرة وتصميم مبسط</p>
                </div>
              </div>
              <Switch checked={isMarketMode} onCheckedChange={toggleMarketMode} />
            </div>

            {isMarketMode && (
              <div className="p-4 rounded-xl bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300">
                  ✅ وضع السوق مفعل - ستظهر الأزرار بحجم أكبر لسهولة الاستخدام
                </p>
              </div>
            )}
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
