/**
 * Navigation Configuration - تكوين التنقل
 * فصل بيانات التنقل عن المكونات
 */

import {
    LayoutDashboard,
    Plane,
    Users,
    Package,
    FileText,
    Ship,
    Warehouse,
    ShoppingCart,
    Receipt,
    DollarSign,
    RefreshCw,
    BookOpen,
    StickyNote,
    Building2,
    Settings,
    FileBarChart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/**
 * عنصر التنقل
 */
export interface NavItem {
    path: string;
    label: string;
    icon: LucideIcon;
}

/**
 * مجموعة التنقل
 */
export interface NavGroup {
    label: string;
    items: NavItem[];
}

/**
 * تكوين التنقل
 */
export const NAV_GROUPS: NavGroup[] = [
    {
        label: 'الرئيسية',
        items: [
            { path: '/', label: 'لوحة التحكم', icon: LayoutDashboard },
            { path: '/trips', label: 'الرحلات', icon: Plane },
            { path: '/accommodation', label: 'السكن', icon: Building2 },
        ],
    },
    {
        label: 'المشتريات',
        items: [
            { path: '/suppliers', label: 'الموردين', icon: Users },
            { path: '/products', label: 'دليل المنتجات', icon: Package },
            { path: '/buying-list', label: 'قائمة مشتريات الرحلة', icon: ShoppingCart },
            { path: '/quotations', label: 'عروض الأسعار', icon: FileText },
            { path: '/purchases', label: 'فواتير الشراء', icon: Receipt },
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
            { path: '/phrases', label: 'دليل المفاوضة', icon: BookOpen },
            { path: '/notes', label: 'الملاحظات', icon: StickyNote },
        ],
    },
    {
        label: 'التقارير الإدارية',
        items: [
            { path: '/reports', label: 'مركز التقارير', icon: FileBarChart },
            { path: '/settings', label: 'الإعدادات', icon: Settings },
        ],
    },
];

/**
 * جميع عناصر التنقل
 */
export const ALL_NAV_ITEMS = NAV_GROUPS.flatMap(g => g.items);

/**
 * عناصر التنقل للـ Bottom Navigation (الموبايل)
 */
export const BOTTOM_NAV_ITEMS: NavItem[] = [
    NAV_GROUPS[0]!.items[0]!, // Dashboard
    NAV_GROUPS[1]!.items[1]!, // Products
    NAV_GROUPS[1]!.items[2]!, // Buying List
    NAV_GROUPS[2]!.items[0]!, // Shipping
    NAV_GROUPS[3]!.items[1]!, // Expenses (Group indices changed because I added a group?)
];

/**
 * الحصول على العنصر الحالي من المسار
 */
export function getCurrentNavItem(pathname: string): NavItem | undefined {
    return ALL_NAV_ITEMS.find(item => item.path === pathname);
}

/**
 * الحصول على العنوان من المسار
 */
export function getPageTitle(pathname: string): string {
    const item = getCurrentNavItem(pathname);
    return item?.label || 'لوحة التحكم';
}
