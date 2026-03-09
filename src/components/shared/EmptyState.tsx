import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, PackageOpen } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ message, icon: Icon = PackageOpen, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-16 text-center"
    >
      <div className="p-4 rounded-2xl bg-muted mb-4">
        <Icon className="w-8 h-8 text-muted-foreground" />
      </div>
      <p className="text-muted-foreground text-sm mb-4">{message}</p>
      {action}
    </motion.div>
  );
}
