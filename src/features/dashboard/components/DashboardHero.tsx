/**
 * Dashboard Hero Component - مكون البطاقة الرئيسية للوحة التحكم
 * مقسم من Dashboard.tsx الكبير
 */

import { motion } from 'framer-motion';
import { Ship, BarChart3, Activity } from 'lucide-react';

interface DashboardHeroProps {
    profitMargin: number;
    activeProducts: number;
    inTransitShipments: number;
}

export function DashboardHero({
    profitMargin,
    activeProducts,
    inTransitShipments
}: DashboardHeroProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="gradient-hero rounded-2xl p-5 lg:p-8 text-sidebar-foreground relative overflow-hidden"
        >
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary blur-3xl" />
                <div className="absolute bottom-0 right-16 w-40 h-40 rounded-full bg-primary blur-3xl" />
            </div>

            <div className="relative z-10">
                <p className="text-sidebar-foreground/50 text-sm font-medium mb-1">
                    مرحباً بك 👋
                </p>
                <h1 className="text-xl lg:text-2xl font-extrabold mb-1">
                    نظام إدارة الاستيراد
                </h1>
                <p className="text-sidebar-foreground/50 text-sm max-w-lg">
                    تتبع رحلاتك ومشترياتك وشحناتك ومبيعاتك في مكان واحد
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                    <HeroStat
                        icon={Activity}
                        label="هامش الربح"
                        value={`${profitMargin}%`}
                        color="text-secondary"
                    />
                    <HeroStat
                        icon={BarChart3}
                        label="المنتجات النشطة"
                        value={String(activeProducts)}
                        color="text-accent"
                    />
                    <HeroStat
                        icon={Ship}
                        label="شحنات في الطريق"
                        value={String(inTransitShipments)}
                        color="text-info"
                    />
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Secondary Hero Stat Component
 */
function HeroStat({
    icon: Icon,
    label,
    value,
    color
}: {
    icon: typeof Activity;
    label: string;
    value: string;
    color: string;
}) {
    return (
        <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <div>
                <p className="text-[10px] text-sidebar-foreground/50">{label}</p>
                <p className="text-sm font-bold">{value}</p>
            </div>
        </div>
    );
}

export default DashboardHero;
