import { motion } from 'framer-motion';
import { StatCard, StatusBadge, StarRating } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { convertCurrency, formatCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import {
  DollarSign, ShoppingCart, TrendingUp, Package,
  Plane, Ship, Users, Warehouse
} from 'lucide-react';

export default function Dashboard() {
  const { trips, suppliers, shipments, inventory, expenses } = useAppStore();

  const totalPurchases = inventory.reduce((s, i) => s + i.quantity_purchased * i.purchase_price, 0);
  const totalSales = inventory.reduce((s, i) => s + i.quantity_sold * i.sale_price, 0);
  const totalExpenses = expenses.reduce((s, e) => s + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD'), 0);
  const totalProfit = totalSales - totalPurchases - totalExpenses;
  const inventoryValue = inventory.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard title="إجمالي المشتريات" value={`$${formatNumber(totalPurchases)}`} icon={ShoppingCart} variant="primary" />
        <StatCard title="إجمالي المبيعات" value={`$${formatNumber(totalSales)}`} icon={DollarSign} variant="secondary" />
        <StatCard title="صافي الربح" value={`$${formatNumber(totalProfit)}`} icon={TrendingUp} variant="accent" trend="+23% من الرحلة السابقة" trendUp />
        <StatCard title="قيمة المخزون" value={`$${formatNumber(inventoryValue)}`} icon={Warehouse} />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard title="الرحلات" value={trips.length} icon={Plane} />
        <StatCard title="الموردين" value={suppliers.length} icon={Users} />
        <StatCard title="الشحنات" value={shipments.length} icon={Ship} />
        <StatCard title="المنتجات" value={inventory.length} icon={Package} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-base mb-3">الرحلات النشطة</h3>
          <div className="space-y-3">
            {trips.map(trip => (
              <div key={trip.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold text-sm">{trip.name}</p>
                  <p className="text-xs text-muted-foreground">{trip.city} • {trip.start_date}</p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-base mb-3">تتبع الشحنات</h3>
          <div className="space-y-3">
            {shipments.map(shipment => (
              <div key={shipment.id} className="p-3 rounded-lg bg-muted/50">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{shipment.shipment_number}</p>
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{shipment.departure_port}</span>
                  <Ship className="w-3 h-3" />
                  <span>{shipment.arrival_port}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{shipment.shipping_company} • {shipment.cartons_count} كرتون</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-base mb-3">أفضل الموردين</h3>
          <div className="space-y-3">
            {[...suppliers].sort((a, b) => b.rating - a.rating).map(sup => (
              <div key={sup.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div>
                  <p className="font-semibold text-sm">{sup.name}</p>
                  <p className="text-xs text-muted-foreground">{sup.company_name}</p>
                </div>
                <StarRating rating={sup.rating} />
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-xl border border-border p-4 shadow-sm">
          <h3 className="font-bold text-base mb-3">حالة المخزون</h3>
          <div className="space-y-3">
            {inventory.map(item => {
              const pct = Math.round((item.quantity_available / item.quantity_purchased) * 100);
              return (
                <div key={item.id} className="p-3 rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center mb-1.5">
                    <p className="font-semibold text-sm">{item.product_name}</p>
                    <span className="text-xs font-bold">{item.quantity_available} متوفر</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${pct > 50 ? 'bg-accent' : pct > 20 ? 'bg-secondary' : 'bg-destructive'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
