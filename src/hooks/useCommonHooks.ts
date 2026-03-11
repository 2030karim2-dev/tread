/**
 * Shared Hooks - خطافات React المشتركة
 * خطافات قابلة لإعادة الاستخدام عبر التطبيق
 */

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Hook لإدارة Debounce
 * @param value - القيمة المراد debounce
 * @param delay - التأخير بالمللي ثانية
 * @returns القيمة المُؤجلة
 * 
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 300);
 * 
 * useEffect(() => {
 *   // API call with debouncedSearch
 * }, [debouncedSearch]);
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}

/**
 * Hook للـ localStorage
 * @param key - مفتاح التخزين
 * @param initialValue - القيمة الأولية
 * @returns [value, setValue]
 * 
 * @example
 * const [theme, setTheme] = useLocalStorage('theme', 'dark');
 */
export function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
    // الحصول على القيمة من localStorage أو استخدام القيمة الأولية
    const [storedValue, setStoredValue] = useState<T>(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }

        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    // دالة لتحديث القيمة
    const setValue = useCallback(
        (value: T | ((prev: T) => T)) => {
            try {
                const valueToStore = value instanceof Function
                    ? value(storedValue)
                    : value;

                setStoredValue(valueToStore);

                if (typeof window !== 'undefined') {
                    window.localStorage.setItem(key, JSON.stringify(valueToStore));
                }
            } catch (error) {
                console.error(`Error setting localStorage key "${key}":`, error);
            }
        },
        [key, storedValue]
    );

    return [storedValue, setValue];
}

/**
 * Hook للتحقق من حجم الشاشة (موبايل/تابلت/ديسكتوب)
 * @returns حجم الشاشة الحالي
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useScreenSize();
 */
export function useScreenSize() {
    const [screenSize, setScreenSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return {
        width: screenSize.width,
        height: screenSize.height,
        isMobile: screenSize.width < 640,
        isTablet: screenSize.width >= 640 && screenSize.width < 1024,
        isDesktop: screenSize.width >= 1024,
        isLargeDesktop: screenSize.width >= 1280,
    };
}

/**
 * Hook للتحقق من Media Query
 * @param query - استعلام CSS
 * @returns是否符合 الاستعلام
 * 
 * @example
 * const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const media = window.matchMedia(query);

        if (media.matches !== matches) {
            setMatches(media.matches);
        }

        const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
        media.addEventListener('change', listener);

        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
}

/**
 * Hook للـ pagination
 * @param totalItems - إجمالي العناصر
 * @param itemsPerPage - العناصر في الصفحة
 * @returns { currentPage, totalPages, nextPage, prevPage, goToPage }
 * 
 * @example
 * const pagination = usePagination(100, 10);
 * // pagination.currentPage = 1
 * // pagination.totalPages = 10
 */
export function usePagination(totalItems: number, itemsPerPage: number = 10) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const nextPage = useCallback(() => {
        setCurrentPage(prev => Math.min(prev + 1, totalPages));
    }, [totalPages]);

    const prevPage = useCallback(() => {
        setCurrentPage(prev => Math.max(prev - 1, 1));
    }, []);

    const goToPage = useCallback((page: number) => {
        const pageNumber = Math.max(1, Math.min(page, totalPages));
        setCurrentPage(pageNumber);
    }, [totalPages]);

    return {
        currentPage,
        totalPages,
        nextPage,
        prevPage,
        goToPage,
        hasNextPage: currentPage < totalPages,
        hasPrevPage: currentPage > 1,
    };
}

/**
 * Hook للـ interval
 * @param callback - الدالة المراد تنفيذها
 * @param delay - التأخير بالمللي ثانية
 * 
 * @example
 * useInterval(() => {
 *   console.log('Hello every 3 seconds');
 * }, 3000);
 */
export function useInterval(callback: () => void, delay: number | null) {
    const savedCallback = useRef(callback);

    // تذكر آخر دالة
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // إعداد الـ interval
    useEffect(() => {
        if (delay === null) return;

        const id = setInterval(() => savedCallback.current(), delay);
        return () => clearInterval(id);
    }, [delay]);
}

/**
 * Hook للـ click outside
 * @param ref - المرجع للعنصر
 * @param handler - الدالة المراد تنفيذها عند النقر خارج العنصر
 * 
 * @example
 * const ref = useRef(null);
 * useClickOutside(ref, () => setIsOpen(false));
 */
export function useClickOutside<T extends HTMLElement>(
    ref: React.RefObject<T>,
    handler: () => void
) {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler();
        };

        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);

        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
}
