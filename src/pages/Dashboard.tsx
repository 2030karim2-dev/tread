import { useMemo } from 'react';
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
  const trips = useAppStore(s => s.trips);
  const suppliers = useAppStore(s => s.suppliers);
  const shipments = useAppStore(s => s.shipments);
  const inventory = useAppStore(s => s.inventory);
  const expenses = useAppStore(s => s.expenses);

  const { totalPurchases, totalSales, totalExpenses, totalProfit, inventoryValue, profitMargin } = useMemo(() => {
    const p = inventory.reduce((s, i) => s + i.quantity_purchased * i.purchase_price, 0);
    const sa = inventory.reduce((s, i) => s + i.quantity_sold * i.sale_price, 0);
    const ex = expenses.reduce((s, e) => s + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD'), 0);
    const pr = sa - p - ex;
    const iv = inventory.reduce((s, i) => s + i.quantity_available * i.sale_price, 0);
    const pm = sa > 0 ? Math.round((pr / sa) * 100) : 0;
    return { totalPurchases: p, totalSales: sa, totalExpenses: ex, totalProfit: pr, inventoryValue: iv, profitMargin: pm };
  }, [inventory, expenses]);

  // Chart data
  const barChartData = useMemo(() => inventory.map(item => ({
    name: item.product_name.length > 12 ? item.product_name.slice(0, 12) + '…' : item.product_name,
    purchases: item.quantity_purchased * item.purchase_price,
    sales: item.quantity_sold * item.sale_price,
  })), [inventory]);

  const expensesByCategory = useMemo(() => Object.entries(
    expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD');
      return acc;
    }, {})
  ).map(([cat, value]) => ({
    name: EXPENSE_CATEGORIES[cat]?.label || cat,
    value: Math.round(value),
  })), [expenses]);
  
  const inTransitCount = useMemo(() => shipments.filter(s => s.status === 'in_transit').length, [shipments]);

  return (
    <div className="space-y-3 sm:space-y-4 lg:space-y-6">
      {/* Welcome Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="gradient-hero rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-8 text-sidebar-foreground relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary blur-3xl" />
          <div className="absolute bottom-0 right-16 w-40 h-40 rounded-full bg-primary blur-3xl" />
        </div>
        <div className="relative z-10">
          <p className="text-sidebar-foreground/50 text-xs sm:text-sm font-medium mb-1">مرحباً بك 👋</p>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-1">نظام إدارة الاستيراد</h1>
          <p className="text-sidebar-foreground/50 text-xs sm:text-sm max-w-lg">
            تتبع رحلاتك ومشترياتك وشحناتك ومبيعاتك في مكان واحد
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
            <div className="flex items-center gap-1.5 sm:gap-2 bg-sidebar-foreground/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
              <div>
                <p className="text-[9px] sm:text-[10px] text-sidebar-foreground/50">هامش الربح</p>
                <p className="text-xs sm:text-sm font-bold">{profitMargin}%</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-sidebar-foreground/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
              <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
              <div>
                <p className="text-[9px] sm:text-[10px] text-sidebar-foreground/50">المنتجات النشطة</p>
                <p className="text-xs sm:text-sm font-bold">{inventory.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 bg-sidebar-foreground/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2">
              <Ship className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" />
              <div>
                <p className="text-[9px] sm:text-[10px] text-sidebar-foreground/50">شحنات في الطريق</p>
                <p className="text-xs sm:text-sm font-bold">{inTransitCount}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Financial Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        <StatCard title="إجمالي المشتريات" value={`$${formatNumber(totalPurchases)}`} icon={ShoppingCart} variant="primary" delay={0.05} />
        <StatCard title="إجمالي المبيعات" value={`$${formatNumber(totalSales)}`} icon={DollarSign} variant="secondary" delay={0.1} />
        <StatCard title="صافي الربح" value={`$${formatNumber(totalProfit)}`} icon={TrendingUp} variant="accent" trend={`المصروفات: $${formatNumber(totalExpenses)}`} trendUp={false} delay={0.15} />
        <StatCard title="قيمة المخزون" value={`$${formatNumber(inventoryValue)}`} icon={Warehouse} delay={0.2} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
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

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
        {/* Active Trips */}
        <ActiveTrips trips={trips.slice(0, 3)} />

        {/* Top Suppliers */}
        <TopSuppliers suppliers={suppliers.slice(0, 3)} />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
        {/* Shipment Tracking */}
        <ShipmentTracking shipments={shipments.slice(0, 3)} />

        {/* Inventory Status */}
        <InventoryStatus inventory={inventory.slice(0, 4)} />
      </div>
    </div>
  );
}
