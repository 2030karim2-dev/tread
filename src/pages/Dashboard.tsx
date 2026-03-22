import { useMemo } from 'react';
import { StatCard, StaggerContainer, StaggerItem } from '@/components/shared';
import { useAppStore } from '@/store/useAppStore';
import { convertCurrency } from '@/lib/currency';
import { formatNumber } from '@/lib/helpers';
import { EXPENSE_CATEGORIES } from '@/constants';
import { Activity, BarChart3, Ship, ShoppingCart, DollarSign, TrendingUp, AlertTriangle, Clock, Search, Users } from 'lucide-react';
import {
  InventoryBarChart,
  ExpensesPieChart,
  QuickCounts,
  ActiveTrips,
  ShipmentTracking,
  TopSuppliers,
  InventoryStatus,
  AgentAlerts,
} from '@/features/dashboard/components';

export default function Dashboard() {
  const trips = useAppStore(s => s.trips);
  const suppliers = useAppStore(s => s.suppliers);
  const shipments = useAppStore(s => s.shipments);
  const inventory = useAppStore(s => s.inventory);
  const expenses = useAppStore(s => s.expenses);
  const quotations = useAppStore(s => s.quotations);
  const purchaseInvoices = useAppStore(s => s.purchaseInvoices);
  const salesInvoices = useAppStore(s => s.salesInvoices);

  const { totalPurchases, totalSales, totalExpenses, totalProfit, profitMargin, potentialRevenue } = useMemo(() => {
    const p = purchaseInvoices.reduce((s, inv) => s + inv.items.reduce((acc, i) => acc + i.quantity * i.purchase_price, 0), 0);
    const sa = salesInvoices.reduce((s, inv) => s + inv.items.reduce((acc, i) => acc + i.quantity * i.sale_price, 0), 0);
    const ex = expenses.reduce((s, e) => s + convertCurrency(e.amount, e.currency as 'CNY' | 'USD' | 'SAR', 'USD'), 0);
    const pr = sa - p - ex;
    const pm = sa > 0 ? Math.round((pr / sa) * 100) : 0;
    
    const potRev = quotations
      .filter(q => q.type === 'outgoing' && q.status !== 'rejected')
      .reduce((s, q) => s + q.items.reduce((acc, i) => acc + i.quantity * (i.purchase_price * (1 + (q.margin_percentage || 0) / 100)), 0), 0);

    return { totalPurchases: p, totalSales: sa, totalExpenses: ex, totalProfit: pr, profitMargin: pm, potentialRevenue: potRev };
  }, [expenses, purchaseInvoices, salesInvoices, quotations]);

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

  const alerts = useMemo(() => {
    const list: any[] = [];
    
    // Quotations needing sourcing
    const pendingQuotes = quotations.filter(q => q.status === 'pending_sourcing');
    if (pendingQuotes.length > 0) {
      list.push({
        id: 'q-pending',
        type: 'quotation',
        title: 'عروض بانتظار التسعير',
        description: `لديك ${pendingQuotes.length} عروض أسعار تحتاج للبحث عن موردين في الصين.`,
        priority: 'high',
        icon: Search
      });
    }

    // Low stock
    const lowStock = inventory.filter(i => i.quantity_available < 10);
    if (lowStock.length > 0) {
      list.push({
        id: 'i-low',
        type: 'inventory',
        title: 'نقص في المخزون',
        description: `هناك ${lowStock.length} منتجات وصلت للحد الأدنى في المستودع.`,
        priority: 'medium',
        icon: AlertTriangle
      });
    }

    // Shipments at warehouse (needs moving)
    const atWarehouse = shipments.filter(s => s.status === 'at_warehouse');
    if (atWarehouse.length > 0) {
      list.push({
        id: 's-warehouse',
        type: 'shipment',
        title: 'شحنات جاهزة في المستودع',
        description: `لديك ${atWarehouse.length} شحنات عالقة في مستودع الصين، انقلها للشحن.`,
        priority: 'medium',
        icon: Clock
      });
    }

    return list;
  }, [quotations, inventory, shipments]);

  return (
    <StaggerContainer className="space-y-3 sm:space-y-4 lg:space-y-6 pb-6">
      {/* Welcome Hero */}
      <StaggerItem>
        <div className="gradient-hero rounded-xl sm:rounded-2xl p-3 sm:p-5 lg:p-8 text-sidebar-foreground relative overflow-hidden shadow-card">
          <div className="absolute inset-0 opacity-15">
            <div className="absolute top-4 left-8 w-32 h-32 rounded-full bg-secondary blur-3xl" />
            <div className="absolute bottom-0 right-16 w-40 h-40 rounded-full bg-primary blur-3xl animate-pulse-soft" />
          </div>
          <div className="relative z-10 hover:translate-x-1 transition-transform duration-500">
            <p className="text-sidebar-foreground/50 text-xs sm:text-sm font-medium mb-1 tracking-wide">مرحباً بك 👋</p>
            <h1 className="text-lg sm:text-xl lg:text-2xl font-extrabold mb-1">نظام إدارة الاستيراد</h1>
            <p className="text-sidebar-foreground/50 text-xs sm:text-sm max-w-lg leading-relaxed">
              تتبع رحلاتك ومشترياتك وشحناتك ومبيعاتك في مكان واحد وبمنتهى الاحترافية
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 mt-3 sm:mt-4">
              <div className="flex items-center gap-1.5 sm:gap-2 bg-sidebar-foreground/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md border border-white/5 hover:bg-sidebar-foreground/20 transition-colors cursor-default">
                <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-secondary" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">هامش الربح</p>
                  <p className="text-xs sm:text-sm font-bold">{profitMargin}%</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-sidebar-foreground/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md border border-white/5 hover:bg-sidebar-foreground/20 transition-colors cursor-default">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-accent" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">المنتجات النشطة</p>
                  <p className="text-xs sm:text-sm font-bold">{inventory.length}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-sidebar-foreground/10 rounded-lg sm:rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md border border-white/5 hover:bg-sidebar-foreground/20 transition-colors cursor-default">
                <Ship className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-info" />
                <div>
                  <p className="text-[9px] sm:text-[10px] text-sidebar-foreground/60 uppercase tracking-wider">شحنات في الطريق</p>
                  <p className="text-xs sm:text-sm font-bold">{inTransitCount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </StaggerItem>

      {/* Financial Stats & Alerts */}
      <StaggerItem>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
          <div className="lg:col-span-2">
            <InventoryBarChart data={barChartData} />
          </div>
          <div>
            <AgentAlerts alerts={alerts} />
          </div>
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <StatCard 
            title="إجمالي المشتريات" 
            value={`$${formatNumber(totalPurchases)}`} 
            icon={ShoppingCart} 
            variant="primary" 
            delay={0.05} 
            sparklineData={[30, 45, 35, 50, 40, 60, 55]}
          />
          <StatCard 
            title="المبيعات الفعلية" 
            value={`$${formatNumber(totalSales)}`} 
            icon={DollarSign} 
            variant="secondary" 
            delay={0.1} 
            sparklineData={[20, 30, 25, 45, 35, 50, 70]}
          />
          <StatCard 
            title="مبيعات متوقعة (Quotes)" 
            value={`$${formatNumber(potentialRevenue)}`} 
            icon={Activity} 
            variant="secondary" 
            trend="عروض لم تعتمد بعد"
            delay={0.15} 
            sparklineData={[10, 15, 20, 50, 30, 40, 45]}
          />
          <StatCard 
            title="صافي الربح" 
            value={`$${formatNumber(totalProfit)}`} 
            icon={TrendingUp} 
            variant="accent" 
            trend={`المصروفات: $${formatNumber(totalExpenses)}`} 
            trendUp={totalProfit > 0} 
            delay={0.2} 
            sparklineData={[10, 20, 15, 25, 20, 35, 40]}
          />
        </div>
      </StaggerItem>

      {/* Charts Section */}
      <StaggerItem>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
          <ExpensesPieChart data={expensesByCategory} />
          <InventoryStatus inventory={inventory.slice(0, 4)} />
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
          {/* Active Trips */}
          <ActiveTrips trips={trips.slice(0, 3)} />

          {/* Top Suppliers */}
          <TopSuppliers suppliers={suppliers.slice(0, 3)} />
        </div>
      </StaggerItem>

      <StaggerItem>
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
          {/* Shipment Tracking */}
          <ShipmentTracking shipments={shipments.slice(0, 3)} />

          {/* Quick Counts for Mobile/Tablet */}
          <QuickCounts
            trips={trips.length}
            suppliers={suppliers.length}
            shipments={shipments.length}
            inventory={inventory.length}
          />
        </div>
      </StaggerItem>
    </StaggerContainer>
  );
}
