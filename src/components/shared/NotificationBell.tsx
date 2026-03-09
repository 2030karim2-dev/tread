import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, AlertTriangle, Ship, Package } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

interface Notification {
  id: string;
  type: 'low_stock' | 'shipment';
  title: string;
  message: string;
  icon: React.ElementType;
  color: string;
}

export function NotificationBell() {
  const { inventory, shipments } = useAppStore();
  const [open, setOpen] = useState(false);

  const notifications: Notification[] = [];

  // Low stock notifications
  inventory.forEach(item => {
    const pct = (item.quantity_available / item.quantity_purchased) * 100;
    if (pct < 30) {
      notifications.push({
        id: `stock-${item.id}`,
        type: 'low_stock',
        title: 'مخزون منخفض',
        message: `${item.product_name} - متبقي ${item.quantity_available} من ${item.quantity_purchased}`,
        icon: AlertTriangle,
        color: 'text-destructive bg-destructive/10',
      });
    }
  });

  // Shipment notifications
  shipments.forEach(s => {
    if (s.status === 'in_transit') {
      notifications.push({
        id: `ship-${s.id}`,
        type: 'shipment',
        title: 'شحنة في الطريق',
        message: `${s.shipment_number} - متوقع الوصول ${s.expected_arrival_date}`,
        icon: Ship,
        color: 'text-info bg-info/10',
      });
    }
    if (s.status === 'arrived') {
      notifications.push({
        id: `ship-arrived-${s.id}`,
        type: 'shipment',
        title: 'شحنة وصلت',
        message: `${s.shipment_number} - وصلت إلى ${s.arrival_port}`,
        icon: Package,
        color: 'text-accent bg-accent/10',
      });
    }
  });

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl hover:bg-muted transition-colors"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-0.5 -left-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] text-[10px] font-bold bg-destructive text-destructive-foreground rounded-full flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute left-0 top-full mt-2 w-80 bg-card rounded-xl border border-border shadow-card-lg z-50 overflow-hidden"
            >
              <div className="p-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-sm">الإشعارات</h3>
                <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {notifications.length}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-sm text-muted-foreground">
                    لا توجد إشعارات جديدة
                  </div>
                ) : (
                  notifications.map((n, i) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-3 border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-lg ${n.color} shrink-0`}>
                          <n.icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-xs">{n.title}</p>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
