import { useLocation, Link } from 'react-router-dom';
import { ChevronLeft, Home } from 'lucide-react';

const PAGE_NAMES: Record<string, string> = {
  '/': 'لوحة التحكم',
  '/trips': 'الرحلات',
  '/suppliers': 'الموردين',
  '/products': 'المنتجات',
  '/quotations': 'عروض الأسعار',
  '/purchases': 'فواتير الشراء',
  '/shipping': 'الشحنات',
  '/inventory': 'المخزون',
  '/sales': 'فواتير البيع',
  '/expenses': 'المصروفات',
  '/currency': 'محول العملات',
};

const PAGE_GROUPS: Record<string, { label: string; path?: string }> = {
  '/trips': { label: 'الرئيسية', path: '/' },
  '/suppliers': { label: 'المشتريات' },
  '/products': { label: 'المشتريات' },
  '/quotations': { label: 'المشتريات' },
  '/purchases': { label: 'المشتريات' },
  '/shipping': { label: 'اللوجستيات' },
  '/inventory': { label: 'اللوجستيات' },
  '/sales': { label: 'المبيعات والمالية' },
  '/expenses': { label: 'المبيعات والمالية' },
  '/currency': { label: 'المبيعات والمالية' },
};

export function Breadcrumbs() {
  const location = useLocation();
  const currentPath = location.pathname;

  if (currentPath === '/') return null;

  const pageName = PAGE_NAMES[currentPath] || '';
  const group = PAGE_GROUPS[currentPath];

  return (
    <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
      <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors">
        <Home className="w-3 h-3" />
        <span>الرئيسية</span>
      </Link>
      {group && (
        <>
          <ChevronLeft className="w-3 h-3" />
          {group.path ? (
            <Link to={group.path} className="hover:text-foreground transition-colors">{group.label}</Link>
          ) : (
            <span>{group.label}</span>
          )}
        </>
      )}
      <ChevronLeft className="w-3 h-3" />
      <span className="text-foreground font-medium">{pageName}</span>
    </nav>
  );
}
