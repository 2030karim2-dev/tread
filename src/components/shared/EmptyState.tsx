import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, PackageOpen } from 'lucide-react';
import { GlowCard } from './AnimatedWrappers';

interface EmptyStateProps {
  title?: string;
  message: string | undefined;
  icon?: LucideIcon;
  action?: ReactNode;
}

export function EmptyState({ title, message, icon: Icon = PackageOpen, action }: EmptyStateProps) {
  if (!message && !title) return null;

  return (
    <GlowCard className="p-8 sm:p-12 w-full flex flex-col items-center justify-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="w-16 h-16 sm:w-20 sm:h-20 bg-muted/50 rounded-full flex items-center justify-center mb-6 shadow-inner relative"
      >
        <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse-soft" />
        <Icon className="w-8 h-8 sm:w-10 sm:h-10 text-muted-foreground/50 relative z-10" />
      </motion.div>
      {title && (
        <motion.h3
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg sm:text-xl font-bold mb-2 text-foreground/80"
        >
          {title}
        </motion.h3>
      )}
      <motion.p
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-sm text-muted-foreground max-w-sm mb-6 inline-block"
      >
        {message}
      </motion.p>
      {action && (
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {action}
        </motion.div>
      )}
    </GlowCard>
  );
}
