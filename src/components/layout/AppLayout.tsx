import { ReactNode, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Plane, Users, Package, FileText, Ship,
  Warehouse, ShoppingCart, Receipt, DollarSign, Menu, X,
  Settings, RefreshCw
} from 'lucide-react';
import logoImg from '@/assets/logo.png';

const navGroups = [
  {
    label: 'الرئيسية',
    items: [
      { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
      { path: '/trips', label: 'الرحلات', icon: Plane },
    ],
  },
  {
    label: 'المشتريات',
    items: [
      { path: '/suppliers', label: 'الموردين', icon: Users },
      { path: '/products', label: 'المنتجات', icon: Package },
      { path: '/quotations', label: 'عروض الأسعار', icon: FileText },
      { path: '/purchases', label: 'فواتير الشراء', icon: ShoppingCart },
    ],
  },
  {
    label: 'اللوجستيات والمخزون',
    items: [
      { path: '/shipping', label: 'الشحنات', icon: Ship },
      { path: '/inventory', label: 'المخزون', icon: Warehouse },
    ],
  },
  {
    label: 'المبيعات والمالية',
    items: [
      { path: '/sales', label: 'فواتير البيع', icon: Receipt },
      { path: '/expenses', label: 'المصروفات', icon: DollarSign },
      { path: '/currency', label: 'محول العملات', icon: RefreshCw },
    ],
  },
];

const allItems = navGroups.flatMap(g => g.items);
const bottomNavItems = [
  allItems[0], // Dashboard
  allItems[2], // Suppliers
  allItems[3], // Products
  allItems[6], // Shipping
  allItems[7], // Inventory
];

function SidebarNav({ items, onNavigate }: { items: typeof navGroups; onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="space-y-5">
      {items.map(group => (
        <div key={group.label}>
          <p className="px-5 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30">
            {group.label}
          </p>
          {group.items.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onNavigate}
                className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-secondary shadow-colored-secondary text-secondary-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className={`w-[18px] h-[18px] ${isActive ? '' : 'opacity-70'}`} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="mr-auto w-1.5 h-1.5 rounded-full bg-secondary-foreground"
                  />
                )}
              </Link>
            );
          })}
        </div>
      ))}
    </div>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = allItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم';

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] gradient-sidebar fixed inset-y-0 right-0 z-40 border-l border-sidebar-border/50">
        {/* Logo */}
        <div className="p-4 pb-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="Logo" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <h1 className="text-base font-extrabold text-sidebar-foreground tracking-tight">
              Auto<span className="text-secondary">Parts</span>
            </h1>
            <p className="text-[10px] text-sidebar-foreground/40 font-medium">نظام إدارة الاستيراد</p>
          </div>
        </div>

        <div className="mx-4 mb-3 h-px bg-sidebar-border/50" />

        {/* Nav */}
        <nav className="flex-1 py-1 overflow-y-auto">
          <SidebarNav items={navGroups} />
        </nav>

        {/* Bottom */}
        <div className="mx-4 h-px bg-sidebar-border/50" />
        <div className="p-3">
          <div className="flex items-center gap-3 p-2.5 rounded-lg bg-sidebar-accent/50">
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground">
              م
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-sidebar-foreground truncate">مدير النظام</p>
              <p className="text-[10px] text-sidebar-foreground/40">الخطة المجانية</p>
            </div>
            <Settings className="w-4 h-4 text-sidebar-foreground/40" />
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: 280 }}
              animate={{ x: 0 }}
              exit={{ x: 280 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[280px] gradient-sidebar z-50 lg:hidden shadow-2xl"
            >
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
                    <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
                  </div>
                  <h1 className="text-base font-extrabold text-sidebar-foreground">
                    Auto<span className="text-secondary">Parts</span>
                  </h1>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mx-4 mb-2 h-px bg-sidebar-border/50" />
              <nav className="py-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                <SidebarNav items={navGroups} onNavigate={() => setSidebarOpen(false)} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:mr-[260px] min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/70 backdrop-blur-2xl border-b border-border/60">
          <div className="px-4 lg:px-6 py-3 flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -mr-2 rounded-xl hover:bg-muted transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1">
              <h2 className="text-base font-bold">{currentPage}</h2>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6 pb-24 lg:pb-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-2xl border-t border-border/60 z-30 safe-area-bottom">
        <div className="flex justify-around items-center py-1 px-1">
          {bottomNavItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-2 rounded-xl text-[10px] transition-all duration-200 min-w-[56px] ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`p-1 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span className="mt-0.5 truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center py-2 px-2 rounded-xl text-[10px] text-muted-foreground min-w-[56px]"
          >
            <div className="p-1">
              <Menu className="w-5 h-5" />
            </div>
            <span className="mt-0.5">المزيد</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
