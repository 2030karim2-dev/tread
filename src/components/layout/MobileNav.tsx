import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo } from 'react';
import { Home, Plus, Search, Bell, Settings, PanelLeftClose, Menu, ChevronLeft } from 'lucide-react';
import { useMobileContext } from '@/contexts/MobileContext';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useSidebarStore } from '@/store/useSidebarStore';

const MOBILE_NAV_ITEMS = [
    { path: '/', icon: Home, label: 'رئيسية' },
    { path: '/search', icon: Search, label: 'بحث' },
    { path: '/add', icon: Plus, label: 'إضافة' },
    { path: '/notifications', icon: Bell, label: 'تنبيهات' },
    { path: '/settings', icon: Settings, label: 'إعدادات' },
];

export function MobileNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { showBottomNav, isMobile } = useMobileContext();
    const { shipments } = useAppStore();
    const { visibility, hideSidebar, showSidebar } = useSidebarStore();

    if (!isMobile || !showBottomNav) return null;

    // Memoize pending count to avoid recalculating on every render
    const pendingCount = useMemo(
        () => shipments.filter(s => s.status === 'in_transit').length,
        [shipments]
    );

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
            <div className="flex items-center justify-around h-14 px-1">
                {/* Sidebar Toggle Button */}
                <button
                    onClick={() => visibility === 'hidden' ? showSidebar() : hideSidebar()}
                    className={cn(
                        "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
                        "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {visibility === 'hidden' ? (
                        <Menu className="w-5 h-5" />
                    ) : (
                        <PanelLeftClose className="w-5 h-5" />
                    )}
                    <span className="text-[9px]">القائمة</span>
                </button>

                {MOBILE_NAV_ITEMS.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <button
                            key={item.path}
                            onClick={() => navigate(item.path)}
                            className={cn(
                                "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors",
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <div className="relative">
                                <Icon className="w-5 h-5" />
                                {item.path === '/notifications' && pendingCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] rounded-full flex items-center justify-center">
                                        {pendingCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-medium">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
}

/**
 * Floating Action Button for quick actions
 */
export function MobileFAB() {
    const navigate = useNavigate();
    const { isMobile } = useMobileContext();

    if (!isMobile) return null;

    return (
        <button
            onClick={() => navigate('/add')}
            className="fixed right-4 bottom-20 z-40 w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform hover:scale-105 active:scale-95"
        >
            <Plus className="w-6 h-6" />
        </button>
    );
}

/**
 * Mobile Header with back button and title
 */
interface MobileHeaderProps {
    title: string;
    showBack?: boolean;
    onBack?: () => void;
    rightAction?: React.ReactNode;
}

export function MobileHeader({ title, showBack, onBack, rightAction }: MobileHeaderProps) {
    const navigate = useNavigate();
    const { isMobile } = useMobileContext();

    if (!isMobile) return null;

    return (
        <header className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border">
            <div className="flex items-center justify-between h-12 px-3">
                <div className="flex items-center gap-2">
                    {showBack && (
                        <button
                            onClick={onBack || (() => navigate(-1))}
                            className="p-1 -ml-1 hover:bg-muted rounded-md"
                        >
                            <ChevronLeft className="w-5 h-5 rtl:rotate-180" />
                        </button>
                    )}
                    <h1 className="text-base font-semibold truncate">{title}</h1>
                </div>
                {rightAction && <div>{rightAction}</div>}
            </div>
        </header>
    );
}

export default MobileNav;
