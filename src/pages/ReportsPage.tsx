import { PageHeader, StaggerContainer, StaggerItem } from '@/components/shared';
import { ReportGenerator } from '@/features/reports/components/ReportGenerator';
import { motion } from 'framer-motion';
import { FileBarChart, History, Share2, ShieldCheck } from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <PageHeader 
        title="مركز التقارير الإدارية" 
        subtitle="أنشئ تقارير شاملة لرحلاتك ومشروعك في ثوانٍ"
      />

      <StaggerContainer className="grid gap-6">
        <StaggerItem>
          <div className="bg-card rounded-3xl border border-border/50 p-6 sm:p-8 shadow-xl shadow-primary/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <ReportGenerator />
          </div>
        </StaggerItem>

        <StaggerItem>
          <div className="grid sm:grid-cols-3 gap-6">
            <FeatureCard 
              icon={History} 
              title="أرشفة ذكية" 
              description="يتم حفظ جميع تقاريرك المصدرة في سجلات النظام لسهولة الرجوع إليها."
              color="text-blue-500"
            />
            <FeatureCard 
              icon={Share2} 
              title="مشاركة سريعة" 
              description="شارك تقارير الـ PDF مباشرة مع عملائك في اليمن عبر واتساب."
              color="text-emerald-500"
            />
            <FeatureCard 
              icon={ShieldCheck} 
              title="دقة مالية" 
              description="عمليات حسابية دقيقة تشمل فروق العملات وهوامش الشحن."
              color="text-amber-500"
            />
          </div>
        </StaggerItem>

        <StaggerItem>
           <div className="p-6 rounded-2xl bg-muted/30 border border-border/50 text-center">
             <p className="text-sm text-muted-foreground">
               تحتاج لتقرير مخصص لم يظهر هنا؟ <span className="text-primary font-bold cursor-pointer hover:underline">اطلب ميزة جديدة</span>
             </p>
           </div>
        </StaggerItem>
      </StaggerContainer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color }: { icon: any, title: string, description: string, color: string }) {
    return (
        <div className="p-6 bg-card rounded-2xl border border-border/40 hover:border-primary/20 transition-all group">
            <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
            </div>
            <h4 className="font-bold text-sm mb-2">{title}</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
    )
}
