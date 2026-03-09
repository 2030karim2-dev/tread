import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, Package, Ship, DollarSign, ArrowLeft, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ONBOARDING_KEY = 'autoparts_onboarding_completed';

const steps = [
  {
    icon: Sparkles,
    title: 'مرحباً بك في AutoParts',
    description: 'نظام متكامل لإدارة عمليات الاستيراد من الصين. تتبع رحلاتك، مورديك، مشترياتك وشحناتك في مكان واحد.',
    color: 'from-primary to-primary/80',
  },
  {
    icon: Plane,
    title: 'إدارة الرحلات والموردين',
    description: 'سجّل رحلاتك إلى الصين، أضف الموردين، واحفظ عروض الأسعار. قارن بين الموردين واختر الأفضل.',
    color: 'from-secondary to-secondary/80',
  },
  {
    icon: Ship,
    title: 'تتبع الشحنات والمخزون',
    description: 'تابع شحناتك من الميناء حتى التسليم. نظام تنبيهات ذكي للمخزون المنخفض.',
    color: 'from-info to-info/80',
  },
  {
    icon: DollarSign,
    title: 'المبيعات والتقارير',
    description: 'أنشئ فواتير البيع، تتبع أرباحك، وحوّل بين العملات (يوان، دولار، ريال) بسهولة.',
    color: 'from-accent to-accent/80',
  },
];

export function OnboardingDialog() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    const done = localStorage.getItem(ONBOARDING_KEY);
    if (!done) setShow(true);
  }, []);

  const finish = () => {
    localStorage.setItem(ONBOARDING_KEY, 'true');
    setShow(false);
  };

  if (!show) return null;

  const current = steps[step];
  const Icon = current.icon;
  const isLast = step === steps.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-foreground/60 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-card rounded-2xl border border-border shadow-card-lg w-full max-w-md overflow-hidden"
        >
          {/* Skip button */}
          <div className="flex justify-end p-3 pb-0">
            <button onClick={finish} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.2 }}
              className="px-8 pb-2 text-center"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${current.color} mx-auto mb-5 flex items-center justify-center shadow-lg`}>
                <Icon className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-xl font-extrabold mb-2">{current.title}</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{current.description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 py-4">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-primary' : 'w-2 bg-muted-foreground/20'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="p-6 pt-2 flex items-center gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" /> السابق
              </Button>
            )}
            <Button
              onClick={isLast ? finish : () => setStep(step + 1)}
              className="flex-1 gradient-primary text-primary-foreground gap-2"
            >
              {isLast ? 'ابدأ الآن ✨' : 'التالي'}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
