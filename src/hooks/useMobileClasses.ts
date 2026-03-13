import { useMobileContext } from '@/contexts/MobileContext';
import { cn } from '@/lib/utils';

/**
 * Hook that provides mobile-aware CSS class utilities.
 * Returns helper functions that automatically apply compact classes on mobile.
 */
export function useMobileClasses() {
    const { isMobile, isTablet, screenSize } = useMobileContext();

    /**
     * Returns mobile-appropriate class string.
     * @param desktopClass - Default desktop class
     * @param mobileClass - Override class for mobile
     * @param tabletClass - Optional override class for tablet
     */
    const mc = (desktopClass: string, mobileClass?: string, tabletClass?: string): string => {
        if (isMobile && mobileClass) return mobileClass;
        if (isTablet && tabletClass) return tabletClass;
        return desktopClass;
    };

    /**
     * Returns responsive font size class.
     */
    const fontSize = (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'): string => {
        const mobileMap: Record<string, string> = {
            '4xl': 'text-xl',
            '3xl': 'text-lg',
            '2xl': 'text-base',
            'xl': 'text-sm',
            'lg': 'text-sm',
            'base': 'text-xs',
            'sm': 'text-xs',
            'xs': 'text-[10px]',
        };

        const tabletMap: Record<string, string> = {
            '4xl': 'text-2xl',
            '3xl': 'text-xl',
            '2xl': 'text-lg',
            'xl': 'text-base',
            'lg': 'text-sm',
            'base': 'text-sm',
            'sm': 'text-xs',
            'xs': 'text-xs',
        };

        if (isMobile) return mobileMap[size] || `text-${size}`;
        if (isTablet) return tabletMap[size] || `text-${size}`;
        return `text-${size}`;
    };

    /**
     * Returns responsive spacing class.
     */
    const spacing = (size: 'sm' | 'md' | 'lg'): string => {
        const map: Record<string, Record<string, string>> = {
            sm: { mobile: 'p-1', tablet: 'p-1.5', desktop: 'p-2' },
            md: { mobile: 'p-2', tablet: 'p-3', desktop: 'p-4' },
            lg: { mobile: 'p-3', tablet: 'p-4', desktop: 'p-6' },
        };
        const device = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
        return map[size]?.[device] || '';
    };

    /**
     * Returns responsive gap class.
     */
    const gap = (size: 'sm' | 'md' | 'lg'): string => {
        const map: Record<string, Record<string, string>> = {
            sm: { mobile: 'gap-1', tablet: 'gap-1.5', desktop: 'gap-2' },
            md: { mobile: 'gap-2', tablet: 'gap-3', desktop: 'gap-4' },
            lg: { mobile: 'gap-3', tablet: 'gap-4', desktop: 'gap-6' },
        };
        const device = isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop';
        return map[size]?.[device] || '';
    };

    /**
     * Returns responsive button size.
     */
    const buttonSize = (): 'sm' | 'default' | 'lg' | 'mobile' | 'mobile-sm' => {
        if (isMobile) return 'mobile';
        return 'default';
    };

    return {
        mc,
        fontSize,
        spacing,
        gap,
        buttonSize,
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        screenSize,
        cn,
    };
}
