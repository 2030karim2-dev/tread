import { ReactNode, useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Command } from 'cmdk';
import {
  LayoutDashboard, Plane, Users, Package, FileText, Ship,
  Warehouse, ShoppingCart, Receipt, DollarSign, Menu, X,
  Settings, RefreshCw, Search, Home, ChevronLeft, Sun, Moon,
  Wallet, BarChart3, ClipboardList, Languages, ShoppingBag
} from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useThemeStore } from '@/store/useThemeStore';
import { MagneticWrapper } from '@/components/shared';

const navGroups = [
  {
    label: 'الرئيسية',
    items: [
      { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
      { path: '/notes', label: 'المتطلبات والملاحظات', icon: ClipboardList },
      { path: '/trips', label: 'الرحلات', icon: Plane },
    ],
  },
  {
    label: 'المشتريات والصين',
    items: [
      { path: '/suppliers', label: 'الموردين', icon: Users },
      { path: '/products', label: 'قاعدة المنتجات', icon: Package },
      { path: '/buying-list', label: 'قائمة المشتريات', icon: ShoppingBag },
      { path: '/quotations', label: 'عروض الأسعار', icon: FileText },
      { path: '/purchases', label: 'فواتير الشراء', icon: ShoppingCart },
    ],
  },
  {
    label: 'المبيعات والمستودع',
    items: [
      { path: '/customers', label: 'العملاء', icon: Users },
      { path: '/sales', label: 'فواتير البيع', icon: Receipt },
      { path: '/shipping', label: 'الشحنات واللوجستيات', icon: Ship },
      { path: '/inventory', label: 'المخزون والجرد', icon: Warehouse },
    ],
  },
  {
    label: 'المالية والتسويات',
    items: [
      { path: '/settlements', label: 'مركز التسويات والديون', icon: Wallet },
      { path: '/expenses', label: 'المصاريف التشغيلية', icon: Receipt },
      { path: '/currency', label: 'محول العملات', icon: RefreshCw },
      { path: '/reports', label: 'التقارير المالية', icon: BarChart3 },
    ],
  },
  {
    label: 'الإعدادات',
    items: [
      { path: '/settings', label: 'إعدادات الشركة', icon: Settings },
      { path: '/phrases', label: 'قاموس المترجم', icon: Languages },
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

function SidebarNav({ items, onNavigate, isCollapsed }: { items: typeof navGroups; onNavigate?: () => void; isCollapsed?: boolean }) {
  const location = useLocation();

  return (
    <div className="space-y-4 mt-2" role="list">
      {items.map((group) => (
        <div key={group.label} role="listitem" className="px-3">
          {/* Group Header */}
          {!isCollapsed && (
            <p className="px-2 mb-2 text-[10px] font-extrabold uppercase tracking-[0.15em] text-sidebar-foreground/40 flex items-center gap-2">
              <span>{group.label}</span>
              <span className="flex-1 h-px bg-gradient-to-l from-sidebar-border/0 via-sidebar-border/50 to-sidebar-border/0" />
            </p>
          )}

          <div className="space-y-1">
            {group.items.map(item => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onNavigate}
                  aria-current={isActive ? 'page' : undefined}
                  title={isCollapsed ? item.label : undefined}
                  className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-300 group overflow-hidden ${
                    isActive
                      ? 'text-primary-foreground shadow-lg shadow-primary/20 bg-primary/90'
                      : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  {/* Background Sparkle for Active State */}
                  {isActive && (
                     <motion.div 
                       layoutId="active-nav-bg"
                       className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary to-primary/80 z-0"
                       initial={false}
                       transition={{ type: "spring", stiffness: 300, damping: 30 }}
                     />
                  )}
                  
                  {/* Top inner border effect for glass */}
                  {isActive && (
                     <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/40 to-transparent z-10 opacity-50" />
                  )}

                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-lg transition-transform duration-300 group-hover:scale-110 shrink-0 ${
                     isActive ? 'bg-white/20 text-white shadow-inner border border-white/10' : 'bg-transparent text-sidebar-foreground/60 group-hover:text-primary'
                  }`}>
                    <item.icon className="w-4 h-4" />
                  </div>

                  {!isCollapsed && (
                    <span className="relative z-10 truncate tracking-wide">
                      {item.label}
                    </span>
                  )}

                  {/* Active Indicator Pillar */}
                  {isActive && !isCollapsed && (
                    <motion.div
                      layoutId="nav-active-indicator"
                      className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)] z-10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
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
    <nav className="flex items-center gap-1 text-[10px] text-muted-foreground" aria-label="مسار التنقل">
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

// Command Palette (CMDK)
function QuickSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const handleSelect = (path: string) => {
    navigate(path);
    setOpen(false);
  };

  return (
    <>
      <MagneticWrapper>
        <button
          onClick={() => setOpen(true)}
          aria-label="بحث"
          aria-expanded={open}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-muted/60 hover:bg-muted border border-border/50 text-muted-foreground text-xs transition-all shadow-sm hover:shadow"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">بحث...</span>
          <kbd className="hidden md:inline text-[9px] bg-background/60 px-1 py-0.5 rounded font-mono border border-border/50">Ctrl+K</kbd>
        </button>
      </MagneticWrapper>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/40 backdrop-blur-sm z-[60]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-card/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 z-[61] overflow-hidden"
              dir="rtl"
            >
              <Command className="w-full h-full bg-transparent flex flex-col" label="بحث عام">
                <div className="flex items-center border-b border-white/10 px-3" cmdk-input-wrapper="">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <Command.Input
                    autoFocus
                    placeholder="ابحث عن صفحة أو ميزة..."
                    className="flex-1 bg-transparent p-4 text-sm outline-none text-foreground placeholder:text-muted-foreground/50 border-none focus:ring-0"
                  />
                  <button onClick={() => setOpen(false)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <Command.List className="max-h-[300px] overflow-y-auto p-2 custom-scrollbar">
                  <Command.Empty className="text-center text-sm text-primary/70 py-6 animate-pulse-soft">
                    لا توجد نتائج مطابقة...
                  </Command.Empty>

                  {navGroups.map(group => (
                    <Command.Group 
                        key={group.label} 
                        heading={group.label} 
                        className="[&_[cmdk-group-heading]]:text-[10px] [&_[cmdk-group-heading]]:text-muted-foreground/70 [&_[cmdk-group-heading]]:mb-2 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-bold [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-widest"
                    >
                      {group.items.map(item => (
                        <Command.Item
                          key={item.path}
                          value={item.label + ' ' + item.path}
                          onSelect={() => handleSelect(item.path)}
                          className="flex items-center gap-3 p-2.5 mb-1 rounded-xl aria-selected:bg-primary/20 hover:bg-primary/10 text-foreground cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                            <item.icon className="w-4 h-4 text-primary" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold">{item.label}</span>
                            <span className="text-[10px] text-muted-foreground opacity-60">{item.path}</span>
                          </div>
                        </Command.Item>
                      ))}
                    </Command.Group>
                  ))}
                </Command.List>
              </Command>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <MagneticWrapper>
      <button
        onClick={toggleTheme}
        aria-label={theme === 'light' ? 'التبديل للوضع الداكن' : 'التبديل للوضع الفاتح'}
        className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground transition-all duration-300 shadow-sm hover:shadow"
        title={theme === 'light' ? 'التبديل للوضع الداكن' : 'التبديل للوضع الفاتح'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ y: 5, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -5, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </motion.div>
        </AnimatePresence>
      </button>
    </MagneticWrapper>
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
      {/* Desktop Sidebar (Floating) */}
      <motion.aside
        initial={false}
        animate={{
          width: isCollapsed ? 88 : 260,
        }}
        className="hidden lg:flex flex-col bg-sidebar/80 backdrop-blur-3xl fixed top-4 bottom-4 right-4 z-40 rounded-[2rem] border border-white/5 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-all duration-500 ease-out"
      >
        {/* Logo */}
        <div className={`p-5 pb-3 flex ${isCollapsed ? 'justify-center' : 'items-center gap-3'} transition-all`}>
          <div className="w-10 h-10 rounded-xl gradient-secondary shadow-colored-secondary flex items-center justify-center overflow-hidden shrink-0 mt-2">
            <img src={logoImg} alt="Logo" className="w-6 h-6 object-contain" />
          </div>
          {!isCollapsed && (
            <div className="mt-2">
              <h1 className="text-xl font-extrabold text-sidebar-foreground tracking-tight whitespace-nowrap">
                Trade<span className="text-secondary">Navigator</span>
              </h1>
            </div>
          )}
        </div>

        <div className="mx-6 mb-4 mt-2 h-px bg-gradient-to-l from-transparent via-sidebar-border/30 to-transparent" />

        {/* Nav */}
        <nav className="flex-1 py-1 overflow-y-auto custom-scrollbar" aria-label="التنقل الرئيسي">
          <SidebarNav items={navGroups} isCollapsed={isCollapsed} />
        </nav>

        {/* Keyboard shortcuts hint */}
        {!isCollapsed && (
          <div className="mx-5 px-3 py-2 bg-sidebar-accent/30 border border-white/5 rounded-xl mb-3 mt-4">
            <p className="text-[10px] text-sidebar-foreground/40 text-center whitespace-nowrap">
              اضغط <kbd className="bg-sidebar-accent px-1.5 py-0.5 rounded-md text-[10px] font-mono border border-border/50">Alt+/</kbd> لعرض الاختصارات
            </p>
          </div>
        )}

        {/* Bottom User Area */}
        <div className="mx-4 h-px bg-gradient-to-l from-transparent via-sidebar-border/30 to-transparent mt-2" />
        <div className="p-4">
          <div className={`flex items-center gap-3 p-3 rounded-2xl bg-sidebar-accent/30 hover:bg-sidebar-accent/50 transition-colors border border-white/5 cursor-pointer ${isCollapsed ? 'justify-center px-0 bg-transparent hover:bg-transparent border-transparent' : ''}`}>
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0 shadow-inner">
              م
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-sidebar-foreground truncate tracking-tight">مدير النظام</p>
                  <p className="text-[11px] text-primary truncate font-medium mt-0.5">الخطة الاحترافية</p>
                </div>
                <Settings className="w-5 h-5 text-sidebar-foreground/40 shrink-0 hover:text-primary transition-colors" />
              </>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Desktop Sidebar Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        aria-label={isCollapsed ? 'توسيع الشريط الجانبي' : 'طي الشريط الجانبي'}
        aria-expanded={!isCollapsed}
        className={`hidden lg:flex fixed top-9 z-50 p-2 rounded-full gradient-secondary text-secondary-foreground shadow-lg shadow-secondary/20 transition-all duration-500 ease-out border border-white/10 hover:scale-110 active:scale-95 ${isCollapsed ? 'right-[88px] -translate-x-1/2 rotate-180' : 'right-[260px] -translate-x-1/2'
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
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground self-end" aria-label="إغلاق القائمة">
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
              <nav className="py-2 overflow-y-auto max-h-[calc(100vh-80px)]" aria-label="التنقل الرئيسي">
                <SidebarNav items={navGroups} onNavigate={() => setSidebarOpen(false)} />
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content — adjust margins for the broader sleek floating sidebar */}
      <main
        className={`flex-1 min-w-0 transition-all duration-500 ease-out ${isCollapsed ? 'lg:mr-[108px]' : 'lg:mr-[280px]'
          }`}
        aria-label="المحتوى الرئيسي"
      >
        {/* ===== Improved Top Bar ===== */}
        <header className="sticky top-0 z-30 bg-gradient-to-l from-background/95 via-background/95 to-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm">
          <div className="px-3 lg:px-5 py-2.5 flex items-center gap-2">
            {/* Mobile menu toggle */}
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة"
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
                    className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${isActive
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

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Notifications */}
            <NotificationBell />
          </div>
        </header>

        {/* Page Content with Layout Transitions */}
        <div className="px-2 sm:px-3 lg:px-5 pt-4 pb-20 lg:pb-6 overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 bg-card/90 backdrop-blur-2xl border-t border-border/60 z-30 safe-area-bottom" aria-label="التنقل السفلي">
        <div className="flex justify-around items-center py-0.5 px-0.5 sm:py-1 sm:px-1">
          {bottomNavItems.map(item => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                className={`flex flex-col items-center py-1 sm:py-2 px-1 sm:px-2 rounded-xl text-[9px] sm:text-[10px] transition-all duration-200 min-w-[44px] sm:min-w-[56px] active:scale-95 ${isActive
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
