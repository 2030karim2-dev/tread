/**
 * SidebarNav Component - مكون التنقل في الـ Sidebar
 * مقسم من AppLayout.tsx
 */

import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { NavGroup } from './navConfig';

interface SidebarNavProps {
    items: NavGroup[];
    onNavigate?: () => void;
}

/**
 * Sidebar Navigation Component
 */
export function SidebarNav({ items, onNavigate }: SidebarNavProps) {
    const location = useLocation();

    return (
        <div className="space-y-5">
            {items.map((group) => (
                <div key={group.label}>
                    <p className="px-5 mb-1.5 text-[10px] font-bold uppercase tracking-widest text-sidebar-foreground/30">
                        {group.label}
                    </p>
                    {group.items.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={onNavigate}
                                className={getNavItemClass(isActive)}
                            >
                                <item.icon className={getIconClass(isActive)} />
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

/**
 * الحصول على class الـ nav item
 */
function getNavItemClass(isActive: boolean): string {
    const base = 'flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-all duration-200';

    if (isActive) {
        return `${base} gradient-secondary shadow-colored-secondary text-secondary-foreground`;
    }

    return `${base} text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground`;
}

/**
 * الحصول على class الأيقونة
 */
function getIconClass(isActive: boolean): string {
    const base = 'w-[18px] h-[18px]';
    return isActive ? base : `${base} opacity-70`;
}

export default SidebarNav;
