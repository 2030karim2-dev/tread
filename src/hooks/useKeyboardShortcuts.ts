import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const SHORTCUTS: Record<string, { path: string; label: string }> = {
  '1': { path: '/', label: 'لوحة التحكم' },
  '2': { path: '/trips', label: 'الرحلات' },
  '3': { path: '/suppliers', label: 'الموردين' },
  '4': { path: '/products', label: 'المنتجات' },
  '5': { path: '/purchases', label: 'فواتير الشراء' },
  '6': { path: '/shipping', label: 'الشحنات' },
  '7': { path: '/inventory', label: 'المخزون' },
  '8': { path: '/sales', label: 'فواتير البيع' },
};

export function useKeyboardShortcuts() {
  const navigate = useNavigate();

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if user is typing in an input
    const tag = (e.target as HTMLElement).tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

    // Alt + number for navigation
    if (e.altKey && SHORTCUTS[e.key]) {
      e.preventDefault();
      const s = SHORTCUTS[e.key];
      navigate(s.path);
      toast.info(`⌨️ ${s.label}`, { duration: 1500 });
    }

    // Alt + ? for shortcuts help
    if (e.altKey && e.key === '/') {
      e.preventDefault();
      const lines = Object.entries(SHORTCUTS).map(([k, v]) => `Alt+${k} → ${v.label}`).join('\n');
      toast.info('اختصارات لوحة المفاتيح', {
        description: lines,
        duration: 5000,
      });
    }
  }, [navigate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
