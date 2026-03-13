import { ReactNode, useState, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Plane, Users, Package, FileText, Ship,
  Warehouse, ShoppingCart, Receipt, DollarSign, Menu, X,
  Settings, RefreshCw, Search, Home, ChevronLeft
} from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

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
      { path: '/customers', label: 'العملاء', icon: Users },
      { path: '/expenses', label: 'المصروفات', icon: DollarSign },
      { path: '/currency', label: 'محول العملات', icon: RefreshCw },
      { path: '/settings', label: 'الإعدادات', icon: Settings },
    ],
  },
];

const allItems = navGroups.flatMap(g => g.items);

const getNavItem = (path: string) => allItems.find(item => item.path === path);

const bottomNavItems = [
  getNavItem('/'),
  getNavItem('/suppliers'),
  getNavItem('/products'),
  getNavItem('/shipping'),
  getNavItem('/inventory'),
].filter(Boolean) as typeof allItems;

// Breadcrumb grouping
const PAGE_GROUPS: Record<string, { label: string; path?: string }> = {
  '/trips': { label: 'الرئيسية', path: '/' },
  '/suppliers': { label: 'المشتريات' },
  '/products': { label: 'المشتريات' },
  '/quotations': { label: 'المشتريات' },
  '/purchases': { label: 'المشتريات' },
  '/shipping': { label: 'اللوجستيات' },
  '/inventory': { label: 'اللوجستيات' },
  '/sales': { label: 'المبيعات والمالية' },
  '/customers': { label: 'المبيعات والمالية' },
  '/expenses': { label: 'المبيعات والمالية' },
  '/currency': { label: 'المبيعات والمالية' },
  '/settings': { label: 'الإعدادات' },
};

// Quick nav shortcuts for header
const HEADER_SHORTCUTS = [
  { path: '/', label: 'الرئيسية', icon: Home },
  { path: '/inventory', label: 'المخزون', icon: Warehouse },
  { path: '/purchases', label: 'المشتريات', icon: ShoppingCart },
  { path: '/sales', label: 'المبيعات', icon: Receipt },
];

function SidebarNav({ items, onNavigate }: { items: typeof navGroups; onNavigate?: () => void }) {
  const location = useLocation();

  return (
    <div className="space-y-3 sm:space-y-5">
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
                className={`flex flex-col items-center gap-1 px-1 sm:px-2 py-1.5 sm:py-2 mx-0.5 sm:mx-1 rounded-lg text-[10px] sm:text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'gradient-secondary shadow-colored-secondary text-secondary-foreground'
                    : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <item.icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? '' : 'opacity-70'}`} />
                <motion.span 
                  animate={isActive ? { 
                    scale: [1, 1.05, 1],
                    color: ['rgba(255,255,255,0.8)', 'rgba(255,255,255,1)', 'rgba(255,255,255,0.8)']
                  } : {}}
                  transition={isActive ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : {}}
                  className="truncate w-full text-center px-1"
                >
                  {item.label}
                </motion.span>
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute right-1 w-0.5 h-4 rounded-full bg-secondary-foreground shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
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

// Inline Breadcrumbs (integrated into header)
function InlineBreadcrumbs({ currentPath, pageName }: { currentPath: string; pageName: string }) {
  if (currentPath === '/') return null;
  const group = PAGE_GROUPS[currentPath];

  return (
    <nav className="flex items-center gap-1 text-[10px] text-muted-foreground">
      <Link to="/" className="flex items-center gap-0.5 hover:text-foreground transition-colors">
        <Home className="w-2.5 h-2.5" />
        <span>الرئيسية</span>
      </Link>
      {group && (
        <>
          <ChevronLeft className="w-2.5 h-2.5" />
          {group.path ? (
            <Link to={group.path} className="hover:text-foreground transition-colors">{group.label}</Link>
          ) : (
            <span>{group.label}</span>
          )}
        </>
      )}
      <ChevronLeft className="w-2.5 h-2.5" />
      <span className="text-foreground font-medium">{pageName}</span>
    </nav>
  );
}

// Quick Search
function QuickSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const results = query.length > 0
    ? allItems.filter(item =>
        item.label.includes(query) ||
        item.path.includes(query.toLowerCase())
      )
    : [];

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
    setQuery('');
  };

  return (
    <>
      <button
        onClick={() => { setOpen(true); setTimeout(() => inputRef.current?.focus(), 100); }}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-muted border border-border/50 text-muted-foreground text-xs transition-all"
      >
        <Search className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">بحث...</span>
        <kbd className="hidden md:inline text-[9px] bg-background/60 px-1 py-0.5 rounded font-mono border border-border/50">Ctrl+K</kbd>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60]"
              onClick={() => { setOpen(false); setQuery(''); }}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-card rounded-2xl shadow-2xl border border-border z-[61] overflow-hidden"
              dir="rtl"
            >
              <div className="flex items-center gap-2 p-3 border-b border-border">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="ابحث عن صفحة أو ميزة..."
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50"
                  onKeyDown={e => {
                    if (e.key === 'Escape') { setOpen(false); setQuery(''); }
                    if (e.key === 'Enter' && results.length > 0 && results[0]) handleSelect(results[0].path);
                  }}
                />
                <button onClick={() => { setOpen(false); setQuery(''); }} className="p-1 rounded hover:bg-muted">
                  <X className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
              <div className="max-h-[300px] overflow-y-auto p-1">
                {results.length > 0 ? (
                  results.map(item => (
                    <button
                      key={item.path}
                      onClick={() => handleSelect(item.path)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl hover:bg-muted text-right transition-colors"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <item.icon className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">{item.path}</p>
                      </div>
                    </button>
                  ))
                ) : query.length > 0 ? (
                  <p className="text-center text-xs text-muted-foreground py-6">لا توجد نتائج</p>
                ) : (
                  <div className="p-2">
                    <p className="text-[10px] text-muted-foreground mb-2 px-2">الصفحات المتوفرة</p>
                    {allItems.map(item => (
                      <button
                        key={item.path}
                        onClick={() => handleSelect(item.path)}
                        className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted text-right transition-colors"
                      >
                        <item.icon className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs">{item.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default function AppLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useKeyboardShortcuts();

  const currentPage = allItems.find(item => item.path === location.pathname)?.label || 'لوحة التحكم';

  return (
    <div className="min-h-screen bg-background flex" dir="rtl">
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 0 : 150,
          opacity: isCollapsed ? 0 : 1,
          x: isCollapsed ? 150 : 0
        }}
        className="hidden lg:flex flex-col gradient-sidebar fixed inset-y-0 right-0 z-40 border-l border-sidebar-border/50 overflow-hidden shadow-2xl"
      >
        {/* Logo */}
        <div className="p-3 pb-2 flex flex-col items-center gap-1 text-center">
          <div className="w-8 h-8 rounded-lg gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
            <img src={logoImg} alt="Logo" className="w-5 h-5 object-contain" />
          </div>
          <div>
            <h1 className="text-xs font-extrabold text-sidebar-foreground tracking-tight">
              Auto<span className="text-secondary">Parts</span>
            </h1>
          </div>
        </div>

        <div className="mx-4 mb-3 h-px bg-sidebar-border/50" />

        {/* Nav */}
        <nav className="flex-1 py-1 overflow-y-auto">
          <SidebarNav items={navGroups} />
        </nav>

        {/* Keyboard shortcuts hint */}
        <div className="mx-4 px-3 py-2 bg-sidebar-accent/50 rounded-lg mb-2">
          <p className="text-[10px] text-sidebar-foreground/40 text-center">
            اضغط <kbd className="bg-sidebar-accent px-1 rounded text-[10px] font-mono">Alt+/</kbd> لعرض الاختصارات
          </p>
        </div>

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
      </motion.aside>

      {/* Desktop Sidebar Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={`hidden lg:flex fixed top-4 z-50 p-2 rounded-full gradient-secondary text-secondary-foreground shadow-lg transition-all duration-300 ${
          isCollapsed ? 'right-4 rotate-180' : 'right-[160px]'
        }`}
      >
        <motion.div animate={{ rotate: isCollapsed ? 180 : 0 }}>
          <X className={`w-4 h-4 ${isCollapsed ? 'hidden' : ''}`} />
          <Menu className={`w-4 h-4 ${isCollapsed ? '' : 'hidden'}`} />
        </motion.div>
      </button>

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
              initial={{ x: 150 }}
              animate={{ x: 0 }}
              exit={{ x: 150 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-[150px] gradient-sidebar z-50 lg:hidden shadow-2xl"
            >
              <div className="p-3 flex flex-col items-center gap-2">
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground self-end">
                  <X className="w-4 h-4" />
                </button>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden">
                    <img src={logoImg} alt="Logo" className="w-5 h-5 object-contain" />
                  </div>
                  <h1 className="text-xs font-extrabold text-sidebar-foreground">
                    Auto<span className="text-secondary">Parts</span>
                  </h1>
                </div>
              </div>
              <div className="mx-4 mb-2 h-px bg-sidebar-border/50" />
              <nav className="py-2 overflow-y-auto max-h-[calc(100vh-80px)]">
                <SidebarNav items={navGroups} onNavigate={() => setSidebarOpen(false)} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content — no margin on mobile, margin only on lg when sidebar visible */}
      <main 
        className={`flex-1 min-w-0 transition-[margin] duration-300 ${
          isCollapsed ? '' : 'lg:mr-[150px]'
        }`}
      >
        {/* ===== Improved Top Bar ===== */}
        <header className="sticky top-0 z-30 bg-gradient-to-l from-primary/5 via-background/95 to-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm">
          <div className="px-3 lg:px-5 py-1.5 flex items-center gap-2">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 -mr-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Page title + breadcrumbs */}
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-bold leading-tight">{currentPage}</h2>
              <InlineBreadcrumbs currentPath={location.pathname} pageName={currentPage} />
            </div>

            {/* Quick nav shortcuts (desktop only) */}
            <div className="hidden lg:flex items-center gap-1 mr-2">
              {HEADER_SHORTCUTS.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                      isActive
                        ? 'bg-primary/15 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                    title={item.label}
                  >
                    <item.icon className="w-3 h-3" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>

            {/* Search */}
            <QuickSearch />

            {/* Notifications */}
            <NotificationBell />
          </div>
        </header>

        {/* Page Content — reduced spacing, no separate breadcrumb */}
        <div className="px-2 sm:px-3 lg:px-5 pt-2 pb-20 lg:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-2xl border-t border-border/60 z-30 safe-area-bottom">
        <div className="flex justify-around items-center py-0.5 px-0.5 sm:py-1 sm:px-1">
          {bottomNavItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-2 rounded-xl text-[9px] sm:text-[10px] transition-all duration-200 min-w-[44px] sm:min-w-[56px] active:scale-95 ${
                  isActive
                    ? 'text-primary font-bold'
                    : 'text-muted-foreground'
                }`}
              >
                <div className={`p-0.5 sm:p-1 rounded-lg transition-colors ${isActive ? 'bg-primary/10' : ''}`}>
                  <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span className="mt-0.5 truncate">{item.label}</span>
              </Link>
            );
          })}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center py-1 sm:py-2 px-1 sm:px-2 rounded-xl text-[9px] sm:text-[10px] text-muted-foreground min-w-[44px] sm:min-w-[56px] active:scale-95"
          >
            <div className="p-0.5 sm:p-1">
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <span className="mt-0.5">المزيد</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
