import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  children?: ReactNode; // action buttons
}

export function PageHeader({ title, children }: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-4"
    >
      <h3 className="text-lg font-bold">{title}</h3>
      {children && <div className="flex gap-2">{children}</div>}
    </motion.div>
  );
}
