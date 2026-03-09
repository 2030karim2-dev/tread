import { ReactNode, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Plane, Users, Package, FileText, Ship,
  Warehouse, ShoppingCart, Receipt, DollarSign, Menu, X, ChevronLeft
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
  { path: '/trips', label: 'الرحلات', icon: Plane },
  { path: '/suppliers', label: 'الموردين', icon: Users },
  { path: '/products', label: 'المنتجات', icon: Package },
  { path: '/quotations', label: 'عروض الأسعار', icon: FileText },
  { path: '/purchases', label: 'فواتير الشراء', icon: ShoppingCart },
  { path: '/shipping', label: 'الشحنات', icon: Ship },
  { path: '/inventory', label: 'المخزون', icon: Warehouse },
  { path: '/sales', label: 'فواتير البيع', icon: Receipt },
  { path: '/expenses', label: 'المصروفات', icon: DollarSign },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentPage = navItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم';

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 gradient-hero text-sidebar-foreground fixed inset-y-0 right-0 z-40">
        <div className="p-5 border-b border-sidebar-border">
          <h1 className="text-xl font-bold text-sidebar-foreground">
            <span className="text-secondary">Auto</span>Parts
          </h1>
          <p className="text-xs text-sidebar-foreground/60 mt-1">نظام إدارة الاستيراد</p>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/50 z-40 lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed inset-y-0 right-0 w-72 gradient-hero text-sidebar-foreground z-50 lg:hidden"
            >
              <div className="p-5 flex items-center justify-between border-b border-sidebar-border">
                <h1 className="text-xl font-bold">
                  <span className="text-secondary">Auto</span>Parts
                </h1>
                <button onClick={() => setSidebarOpen(false)} className="text-sidebar-foreground/70 hover:text-sidebar-foreground">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="py-4">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-5 py-3 mx-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:mr-64">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold">{currentPage}</h2>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6 pb-24 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/95 backdrop-blur-xl border-t border-border z-30 safe-area-bottom">
        <div className="flex justify-around items-center py-1">
          {navItems.slice(0, 5).map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg text-xs transition-all ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground'
                }`}
              >
                <item.icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-primary' : ''}`} />
                <span className="truncate max-w-[60px]">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center py-2 px-3 rounded-lg text-xs text-muted-foreground"
          >
            <Menu className="w-5 h-5 mb-0.5" />
            <span>المزيد</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
