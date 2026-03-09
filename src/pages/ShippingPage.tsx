import { motion } from 'framer-motion';
import { PageHeader, StatusBadge } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { Ship, MapPin, Package, DollarSign, Weight, Calendar } from 'lucide-react';

export default function ShippingPage() {
  const { shipments } = useAppStore();

  return (
    <div className="space-y-4">
      <PageHeader title="إدارة الشحنات" />

      <div className="grid gap-4 sm:grid-cols-2">
        {shipments.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-card rounded-xl border border-border p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg gradient-primary"><Ship className="w-4 h-4 text-primary-foreground" /></div>
                <div>
                  <h4 className="font-bold text-sm">{s.shipment_number}</h4>
                  <p className="text-xs text-muted-foreground">{s.shipping_company}</p>
                </div>
              </div>
              <StatusBadge status={s.status} />
            </div>

            <div className="flex items-center gap-3 mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="text-center">
                <MapPin className="w-4 h-4 mx-auto text-primary mb-1" />
                <p className="text-xs font-semibold">{s.departure_port}</p>
              </div>
              <div className="flex-1 border-t-2 border-dashed border-primary/30 relative">
                <Ship className="w-4 h-4 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-muted/50" />
              </div>
              <div className="text-center">
                <MapPin className="w-4 h-4 mx-auto text-secondary mb-1" />
                <p className="text-xs font-semibold">{s.arrival_port}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-3.5 h-3.5" /> شحن: {s.ship_date}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Calendar className="w-3.5 h-3.5" /> وصول: {s.expected_arrival_date}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><DollarSign className="w-3.5 h-3.5" /> ${s.shipping_cost.toLocaleString()}</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Package className="w-3.5 h-3.5" /> {s.cartons_count} كرتون</div>
              <div className="flex items-center gap-1.5 text-muted-foreground"><Weight className="w-3.5 h-3.5" /> {s.weight} كغ</div>
              <div className="flex items-center gap-1.5 text-muted-foreground">{s.shipping_type === 'sea' ? '🚢 بحري' : '✈️ جوي'}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
