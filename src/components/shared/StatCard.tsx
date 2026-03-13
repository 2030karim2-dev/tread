import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
  delay?: number;
}

const variantConfig = {
  default: {
    card: 'bg-card border border-border shadow-card',
    icon: 'bg-muted text-muted-foreground',
    text: 'text-foreground',
    sub: 'text-muted-foreground',
  },
  primary: {
    card: 'gradient-primary shadow-colored-primary gradient-card-shine',
    icon: 'bg-primary-foreground/15 text-primary-foreground',
    text: 'text-primary-foreground',
    sub: 'text-primary-foreground/70',
  },
  secondary: {
    card: 'gradient-secondary shadow-colored-secondary gradient-card-shine',
    icon: 'bg-secondary-foreground/15 text-secondary-foreground',
    text: 'text-secondary-foreground',
    sub: 'text-secondary-foreground/70',
  },
  accent: {
    card: 'gradient-accent shadow-colored-accent gradient-card-shine',
    icon: 'bg-accent-foreground/15 text-accent-foreground',
    text: 'text-accent-foreground',
    sub: 'text-accent-foreground/70',
  },
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, variant = 'default', delay = 0 }: StatCardProps) {
  const config = variantConfig[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: 'easeOut' }}
      className={`rounded-xl sm:rounded-2xl p-2.5 sm:p-4 lg:p-5 ${config.card}`}
    >
      <div className="flex items-start justify-between mb-1.5 sm:mb-3">
        <span className={`text-[10px] sm:text-xs lg:text-sm font-medium ${config.sub} leading-tight`}>
          {title}
        </span>
        <div className={`p-1 sm:p-2 lg:p-2.5 rounded-lg sm:rounded-xl ${config.icon}`}>
          <Icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
        </div>
      </div>
      <div className={`text-base sm:text-xl lg:text-2xl font-extrabold ${config.text} tracking-tight`}>{value}</div>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 sm:mt-2 ${trendUp ? 'text-success' : 'text-destructive'}`}>
          {trendUp ? <TrendingUp className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> : <TrendingDown className="w-2.5 h-2.5 sm:w-3 sm:h-3" />}
          <span className="text-[9px] sm:text-[11px] font-semibold">{trend}</span>
        </div>
      )}
    </motion.div>
  );
}

