/**
 * Stats Cards Component - بطاقات الإحصائيات
 * مقسم من Dashboard.tsx الكبير
 */

import { DollarSign, ShoppingCart, TrendingUp, Package } from 'lucide-react';
import { StatCard } from '@/components/shared/StatCard';
import { formatNumber } from '@/lib/helpers';
import type { DashboardStats } from '../hooks/useDashboardStats';

interface StatsCardsProps {
    stats: DashboardStats;
}

const CARD_VARIANTS = ['primary', 'secondary', 'accent', 'info'] as const;

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: 'إجمالي المشتريات',
            value: `$${formatNumber(stats.totalPurchases)}`,
            icon: ShoppingCart,
            variant: 'primary' as const,
            delay: 0.05,
        },
        {
            title: 'إجمالي المبيعات',
            value: `$${formatNumber(stats.totalSales)}`,
            icon: DollarSign,
            variant: 'secondary' as const,
            delay: 0.1,
        },
        {
            title: 'صافي الربح',
            value: `$${formatNumber(stats.netProfit)}`,
            icon: TrendingUp,
            variant: 'accent' as const,
            trend: `+${stats.profitMargin}% من الرحلة السابقة`,
            trendUp: true,
            delay: 0.15,
        },
        {
            title: 'قيمة المخزون',
            value: `$${formatNumber(stats.inventoryValue)}`,
            icon: Package,
            variant: 'info' as const,
            delay: 0.2,
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
            {cards.map((card, index) => (
                <StatCard
                    key={card.title}
                    title={card.title}
                    value={card.value}
                    icon={card.icon}
                    variant={card.variant}
                    trend={card.trend}
                    trendUp={card.trendUp}
                    delay={card.delay}
                />
            ))}
        </div>
    );
}

export default StatsCards;
