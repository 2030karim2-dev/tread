import { motion } from 'framer-motion';
import { StatCard } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { EXPENSE_CATEGORIES } from '@/constants';
import { Activity, BarChart3, Ship, ShoppingCart, DollarSign, TrendingUp, Warehouse } from 'lucide-react';
import {
  InventoryBarChart,
  ExpensesPieChart,
  QuickCounts,
  ActiveTrips,
  ShipmentTracking,
  TopSuppliers,
  InventoryStatus,
} from '@/features/dashboard/components';

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
        <InventoryBarChart data={barChartData} />
        <ExpensesPieChart data={expensesByCategory} />
      </div>

      {/* Quick Counts */}
      <QuickCounts
        trips={trips.length}
        suppliers={suppliers.length}
        shipments={shipments.length}
        inventory={inventory.length}
      />

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Active Trips */}
        <ActiveTrips trips={trips} />

        {/* Shipment Tracking */}
        <ShipmentTracking shipments={shipments} />

        {/* Top Suppliers */}
        <TopSuppliers suppliers={suppliers} />

        {/* Inventory Status */}
        <InventoryStatus inventory={inventory} />
      </div>
    </div>
  );
}
