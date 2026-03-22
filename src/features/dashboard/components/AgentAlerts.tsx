import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AlertItem {
  id: string;
  type: 'quotation' | 'shipment' | 'inventory';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  icon: any;
}

export interface AgentAlertsProps {
  alerts: AlertItem[];
}

export function AgentAlerts({ alerts }: AgentAlertsProps) {
  if (alerts.length === 0) return null;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-card overflow-hidden relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-red-500/10 text-red-500">
            <Zap className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-sm">تنبيهات عاجلة (Urgent)</h3>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">
          {alerts.length} مهام
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert, i) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`p-3 rounded-xl border flex gap-3 items-start transition-all hover:translate-x-[-4px] ${
              alert.priority === 'high' 
                ? 'bg-red-500/5 border-red-500/10' 
                : 'bg-muted/30 border-border/50'
            }`}
          >
            <div className={`p-2 rounded-lg shrink-0 ${
              alert.priority === 'high' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'
            }`}>
              <alert.icon className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold truncate">{alert.title}</h4>
              <p className="text-[10px] text-muted-foreground line-clamp-1">{alert.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <Button variant="ghost" className="w-full mt-4 text-[10px] h-8 text-muted-foreground hover:text-primary">
        عرض جميع المهام المعلقة
      </Button>
    </div>
  );
}
