import { memo } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { GlowCard } from './AnimatedWrappers';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  delay?: number;
  sparklineData?: number[]; // [جديد] بيانات الرسم البياني المصغر
}

// Sparkline component
function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100;
  const height = 30;

  const points = data.map((val, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((val - min) / range) * height
  }));

  const path = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;

  return (
    <div className="h-8 w-16 sm:w-24 opacity-50 overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
        <motion.path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}

const variantConfig = {
  default: {
    card: 'bg-card border border-border shadow-card',
    icon: 'bg-muted text-muted-foreground',
    text: 'text-foreground',
    sub: 'text-muted-foreground',
    sparkline: 'currentColor'
  },
  primary: {
    card: 'gradient-primary shadow-colored-primary gradient-card-shine',
    icon: 'bg-primary-foreground/15 text-primary-foreground',
    text: 'text-primary-foreground',
    sub: 'text-primary-foreground/70',
    sparkline: 'rgba(255,255,255,0.6)'
  },
  secondary: {
    card: 'gradient-secondary shadow-colored-secondary gradient-card-shine',
    icon: 'bg-secondary-foreground/15 text-secondary-foreground',
    text: 'text-secondary-foreground',
    sub: 'text-secondary-foreground/70',
    sparkline: 'rgba(255,255,255,0.6)'
  },
  accent: {
    card: 'gradient-accent shadow-colored-accent gradient-card-shine',
    icon: 'bg-accent-foreground/15 text-accent-foreground',
    text: 'text-accent-foreground',
    sub: 'text-accent-foreground/70',
    sparkline: 'rgba(255,255,255,0.6)'
  },
};

export const StatCard = memo(function StatCard({ title, value, icon: Icon, trend, trendUp, variant = 'default', delay = 0, sparklineData }: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className="h-full"
    >
      <GlowCard className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 relative h-full flex flex-col justify-between ${config.card}`}>
        <div className="flex items-start justify-between mb-1.5 sm:mb-3">
          <span className={`text-[10px] sm:text-xs lg:text-sm font-medium ${config.sub} leading-tight`}>
            {title}
          </span>
          <div className={`p-1 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl z-20 ${config.icon}`}>
            <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <div className="z-20">
            <div className={`text-base sm:text-xl lg:text-2xl font-extrabold ${config.text} tracking-tight`}>{value}</div>
            {trend && (
              <div className={`flex items-center gap-1 mt-1 sm:mt-2 ${trendUp ? 'text-success' : 'text-destructive'}`}>
                {trendUp ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
                <span className="text-[9px] sm:text-[11px] font-semibold">{trend}</span>
              </div>
            )}
          </div>

          {sparklineData && (
            <div className="mb-1 pointer-events-none z-10 opacity-80">
              <Sparkline data={sparklineData} color={config.sparkline} />
            </div>
          )}
        </div>
      </GlowCard>
    </motion.div>
  );
});
