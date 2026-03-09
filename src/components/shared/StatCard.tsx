import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: 'default' | 'primary' | 'secondary' | 'accent';
}

const variantStyles = {
  default: 'bg-card border border-border',
  primary: 'gradient-primary text-primary-foreground',
  secondary: 'gradient-secondary text-secondary-foreground',
  accent: 'bg-accent text-accent-foreground',
};

const iconBg = {
  default: 'bg-muted',
  primary: 'bg-primary-foreground/20',
  secondary: 'bg-secondary-foreground/20',
  accent: 'bg-accent-foreground/20',
};

export function StatCard({ title, value, icon: Icon, trend, trendUp, variant = 'default' }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-4 shadow-sm ${variantStyles[variant]}`}
    >
      <div className="flex items-center justify-between mb-3">
        <span className={`text-sm font-medium ${variant === 'default' ? 'text-muted-foreground' : 'opacity-80'}`}>
          {title}
        </span>
        <div className={`p-2 rounded-lg ${iconBg[variant]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {trend && (
        <p className={`text-xs mt-1 font-medium ${trendUp ? 'text-success' : 'text-destructive'}`}>
          {trend}
        </p>
      )}
    </motion.div>
  );
}
