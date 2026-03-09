import { motion } from 'framer-motion';
import { PageHeader, StatusBadge } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { STATUS_LABELS } from '@/constants';
import { Ship, MapPin, Package, DollarSign, Weight, Calendar, Anchor, Clock, Check, Circle } from 'lucide-react';

const TIMELINE_STAGES = ['purchased', 'at_warehouse', 'shipped', 'in_transit', 'arrived', 'delivered'] as const;
const STAGE_ICONS: Record<string, React.ElementType> = {
  purchased: Package,
  at_warehouse: Anchor,
  shipped: Ship,
  in_transit: Ship,
  arrived: MapPin,
  delivered: Check,
};

const statusProgress: Record<string, number> = {
  purchased: 15,
  at_warehouse: 30,
  shipped: 45,
  in_transit: 65,
  arrived: 85,
  delivered: 100,
};

export default function ShippingPage() {
  const { shipments } = useAppStore();

  return (
    <div className="space-y-4">
      <PageHeader title="إدارة الشحنات" subtitle={`${shipments.length} شحنة`} />

      <div className="grid gap-4 lg:grid-cols-2">
        {shipments.map((s, i) => {
          const progress = statusProgress[s.status] || 0;
          const currentIdx = TIMELINE_STAGES.indexOf(s.status as typeof TIMELINE_STAGES[number]);

          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card rounded-2xl border border-border p-5 shadow-card glass-card-hover"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl gradient-primary shadow-colored-primary flex items-center justify-center">
                    <Ship className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{s.shipment_number}</h4>
                    <p className="text-xs text-muted-foreground">{s.shipping_company}</p>
                  </div>
                </div>
                <StatusBadge status={s.status} />
              </div>

              {/* Route visualization */}
              <div className="mb-4 p-3 bg-muted/40 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mb-1">
                      <Anchor className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-[10px] font-bold">{s.departure_port}</p>
                  </div>
                  <div className="flex-1 relative">
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full gradient-secondary rounded-full"
                      />
                    </div>
                    <Ship className="w-4 h-4 text-secondary absolute top-1/2 -translate-y-1/2 bg-card p-0.5 rounded"
                      style={{ left: `${Math.min(progress - 5, 90)}%` }}
                    />
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center mb-1">
                      <MapPin className="w-4 h-4 text-accent" />
                    </div>
                    <p className="text-[10px] font-bold">{s.arrival_port}</p>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="mb-4 px-2">
                <div className="flex items-center justify-between">
                  {TIMELINE_STAGES.map((stage, idx) => {
                    const StageIcon = STAGE_ICONS[stage];
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;
                    const isFuture = idx > currentIdx;

                    return (
                      <div key={stage} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: idx * 0.08 }}
                            className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                              isCompleted
                                ? 'bg-accent border-accent text-accent-foreground'
                                : isCurrent
                                ? 'bg-primary border-primary text-primary-foreground ring-4 ring-primary/20'
                                : 'bg-muted border-border text-muted-foreground'
                            }`}
                          >
                            {isCompleted ? (
                              <Check className="w-3.5 h-3.5" />
                            ) : (
                              <StageIcon className="w-3 h-3" />
                            )}
                          </motion.div>
                          <p className={`text-[9px] mt-1 text-center leading-tight max-w-[50px] ${
                            isCurrent ? 'font-bold text-primary' : isFuture ? 'text-muted-foreground' : 'font-medium text-accent'
                          }`}>
                            {STATUS_LABELS[stage]}
                          </p>
                        </div>
                        {idx < TIMELINE_STAGES.length - 1 && (
                          <div className={`flex-1 h-0.5 mx-1 rounded-full mt-[-14px] ${
                            idx < currentIdx ? 'bg-accent' : 'bg-border'
                          }`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Details grid */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <Calendar className="w-3.5 h-3.5 mx-auto mb-1 text-primary" />
                  <p className="text-[10px] text-muted-foreground">شحن</p>
                  <p className="font-semibold">{s.ship_date}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <Clock className="w-3.5 h-3.5 mx-auto mb-1 text-secondary" />
                  <p className="text-[10px] text-muted-foreground">وصول متوقع</p>
                  <p className="font-semibold">{s.expected_arrival_date}</p>
                </div>
                <div className="bg-muted/40 rounded-lg p-2 text-center">
                  <DollarSign className="w-3.5 h-3.5 mx-auto mb-1 text-accent" />
                  <p className="text-[10px] text-muted-foreground">التكلفة</p>
                  <p className="font-semibold">${s.shipping_cost.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Package className="w-3 h-3" />
                    {s.cartons_count} كرتون
                  </span>
                  <span className="flex items-center gap-1">
                    <Weight className="w-3 h-3" />
                    {s.weight} كغ
                  </span>
                </div>
                <span className="font-medium">{s.shipping_type === 'sea' ? '🚢 بحري' : '✈️ جوي'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
