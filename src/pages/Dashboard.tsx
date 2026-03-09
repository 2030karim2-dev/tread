import { motion } from 'framer-motion';
import { StatCard, StatusBadge, StarRating } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { EXPENSE_CATEGORIES } from '@/constants';
import {
  DollarSign, ShoppingCart, TrendingUp, Package,
  Plane, Ship, Users, Warehouse, BarChart3, Activity
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

const CHART_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--secondary))',
  'hsl(var(--accent))',
  'hsl(var(--info))',
  'hsl(var(--warning))',
  'hsl(var(--destructive))',
];

export default function Dashboard() {
  const { trips, suppliers, shipments, inventory, expenses } = useAppStore();

  const totalPurchases = inventory.reduce((s, i) => s + i.quantity_purchased * i.purchase_price, 0);
  const totalSales = inventory.reduce((s, i) => s + i.quantity_sold * i.sale_price, 0);
  const totalExpenses = expenses.reduce((s, e) => s + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD'), 0);
  const totalProfit = totalSales - totalPurchases - totalExpenses;
  const inventoryValue = inventory.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);
  const profitMargin = totalSales > 0 ? Math.round((totalProfit / totalSales) * 100) : 0;

  // Chart data
  const barChartData = inventory.map(item => ({
    name: item.product_name.length > 12 ? item.product_name.slice(0, 12) + '…' : item.product_name,
    purchases: item.quantity_purchased * item.purchase_price,
    sales: item.quantity_sold * item.sale_price,
  }));

  const expensesByCategory = Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD');
      return acc;
    }, {})
  ).map(([cat, value]) => ({
    name: EXPENSE_CATEGORIES[cat]?.label || cat,
    value: Math.round(value),
  }));

  return (
    <div className="space-y-6">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-hero rounded-2xl p-5 lg:p-8 text-sidebar-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-0 right-16 w-40 h-40 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-sidebar-foreground/50 text-sm font-medium mb-1">مرحباً بك 👋</p>
          <h1 className="text-xl lg:text-2xl font-extrabold mb-1">نظام إدارة الاستيراد</h1>
          <p className="text-sidebar-foreground/50 text-sm max-w-lg">
            تتبع رحلاتك ومشترياتك وشحناتك ومبيعاتك في مكان واحد
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
              <Activity className="w-4 h-4 text-secondary" />
              <div>
                <p className="text-[10px] text-sidebar-foreground/50">هامش الربح</p>
                <p className="text-sm font-bold">{profitMargin}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
              <BarChart3 className="w-4 h-4 text-accent" />
              <div>
                <p className="text-[10px] text-sidebar-foreground/50">المنتجات النشطة</p>
                <p className="text-sm font-bold">{inventory.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-sidebar-foreground/10 rounded-xl px-3 py-2">
              <Ship className="w-4 h-4 text-info" />
              <div>
                <p className="text-[10px] text-sidebar-foreground/50">شحنات في الطريق</p>
                <p className="text-sm font-bold">{shipments.filter(s => s.status === 'in_transit').length}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <StatCard title="إجمالي المشتريات" value={`$${formatNumber(totalPurchases)}`} icon={ShoppingCart} variant="primary" delay={0.05} />
        <StatCard title="إجمالي المبيعات" value={`$${formatNumber(totalSales)}`} icon={DollarSign} variant="secondary" delay={0.1} />
        <StatCard title="صافي الربح" value={`$${formatNumber(totalProfit)}`} icon={TrendingUp} variant="accent" trend="+23% من الرحلة السابقة" trendUp delay={0.15} />
        <StatCard title="قيمة المخزون" value={`$${formatNumber(inventoryValue)}`} icon={Warehouse} delay={0.2} />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-primary" />
            المشتريات مقابل المبيعات
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barChartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`$${formatNumber(value)}`, '']}
                />
                <Bar dataKey="purchases" name="المشتريات" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sales" name="المبيعات" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <h3 className="font-bold text-sm flex items-center gap-2 mb-4">
            <DollarSign className="w-4 h-4 text-secondary" />
            توزيع المصاريف
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expensesByCategory.map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    fontSize: 12,
                  }}
                  formatter={(value: number) => [`$${value}`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Quick Counts */}
      <div className="grid grid-cols-4 gap-2 lg:gap-3">
        {[
          { label: 'الرحلات', value: trips.length, icon: Plane, color: 'text-primary' },
          { label: 'الموردين', value: suppliers.length, icon: Users, color: 'text-secondary' },
          { label: 'الشحنات', value: shipments.length, icon: Ship, color: 'text-info' },
          { label: 'المنتجات', value: inventory.length, icon: Package, color: 'text-accent' },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.05 }}
            className="bg-card rounded-xl border border-border p-3 shadow-card text-center"
          >
            <item.icon className={`w-5 h-5 mx-auto mb-1.5 ${item.color}`} />
            <p className="text-lg lg:text-xl font-extrabold">{item.value}</p>
            <p className="text-[10px] text-muted-foreground font-medium">{item.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active Trips */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary" />
              الرحلات النشطة
            </h3>
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{trips.length} رحلة</span>
          </div>
          <div className="space-y-2.5">
            {trips.map(trip => (
              <div key={trip.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{trip.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{trip.city} • {trip.start_date}</p>
                </div>
                <StatusBadge status={trip.status} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Shipment Tracking */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Ship className="w-4 h-4 text-info" />
              تتبع الشحنات
            </h3>
            <span className="text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{shipments.length} شحنة</span>
          </div>
          <div className="space-y-2.5">
            {shipments.map(shipment => (
              <div key={shipment.id} className="p-3 rounded-xl bg-muted/40">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-semibold text-sm">{shipment.shipment_number}</p>
                  <StatusBadge status={shipment.status} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">{shipment.departure_port}</span>
                  <div className="flex-1 h-px bg-border relative">
                    <Ship className="w-3 h-3 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card rounded" />
                  </div>
                  <span className="font-medium">{shipment.arrival_port}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">{shipment.shipping_company} • {shipment.cartons_count} كرتون</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Suppliers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              أفضل الموردين
            </h3>
          </div>
          <div className="space-y-2.5">
            {[...suppliers].sort((a, b) => b.rating - a.rating).map((sup, i) => (
              <div key={sup.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{sup.name}</p>
                    <p className="text-xs text-muted-foreground">{sup.company_name}</p>
                  </div>
                </div>
                <StarRating rating={sup.rating} />
              </div>
            ))}
          </div>
        </motion.div>

        {/* Inventory Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }} className="bg-card rounded-2xl border border-border p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm flex items-center gap-2">
              <Warehouse className="w-4 h-4 text-accent" />
              حالة المخزون
            </h3>
          </div>
          <div className="space-y-3">
            {inventory.map(item => {
              const pct = Math.round((item.quantity_available / item.quantity_purchased) * 100);
              const isLow = pct < 30;
              return (
                <div key={item.id} className="p-3 rounded-xl bg-muted/40">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-sm">{item.product_name}</p>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      isLow ? 'bg-destructive/10 text-destructive' : 'bg-accent/10 text-accent'
                    }`}>
                      {item.quantity_available} متوفر
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full rounded-full ${
                        pct > 50 ? 'bg-accent' : pct > 20 ? 'bg-secondary' : 'bg-destructive'
                      }`}
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
