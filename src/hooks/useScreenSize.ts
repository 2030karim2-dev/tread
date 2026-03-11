import { useState, useEffect, useCallback } from 'react';

export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const SCREEN_SIZES: Record<ScreenSize, number> = {
    xs: 375,   // Mobile small
    sm: 640,   // Mobile large
    md: 768,   // Tablet
    lg: 1024,  // Desktop
    xl: 1280,  // Desktop large
    '2xl': 1536, // Desktop extra large
};

const getScreenSize = (width: number): ScreenSize => {
    if (width < SCREEN_SIZES.sm) return 'xs';
    if (width < SCREEN_SIZES.md) return 'sm';
    if (width < SCREEN_SIZES.lg) return 'md';
    if (width < SCREEN_SIZES.xl) return 'lg';
    if (width < SCREEN_SIZES['2xl']) return 'xl';
    return '2xl';
};

/**
 * Hook to get current screen size
 */
export function useScreenSize(): ScreenSize {
    const [screenSize, setScreenSize] = useState<ScreenSize>(() =>
        typeof window !== 'undefined' ? getScreenSize(window.innerWidth) : 'lg'
    );

    useEffect(() => {
        const handleResize = () => {
            setScreenSize(getScreenSize(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

/**
 * Hook to check if current viewport is mobile
 */
export function useIsMobile(): boolean {
    const screenSize = useScreenSize();
    return screenSize === 'xs' || screenSize === 'sm';
}

/**
 * Hook to check if current viewport is tablet
 */
export function useIsTablet(): boolean {
    const screenSize = useScreenSize();
    return screenSize === 'md';
}

/**
 * Hook to check if current viewport is desktop
 */
export function useIsDesktop(): boolean {
    const screenSize = useScreenSize();
    return screenSize >= 'lg';
}

/**
 * Hook for mobile-specific rendering
 */
export function useMobileOptimize() {
    const screenSize = useScreenSize();
    const isXs = screenSize === 'xs';
    const isSm = screenSize === 'sm';
    const isMobile = isXs || isSm;
    const isTablet = screenSize === 'md';

    // Scale factors based on screen size
    const scale = isXs ? 0.5 : isSm ? 0.6 : isTablet ? 0.75 : 1;
    const fontScale = isXs ? 0.7 : isSm ? 0.8 : isTablet ? 0.9 : 1;

    // Spacing scale
    const spacing = isMobile ? 0.5 : isTablet ? 0.75 : 1;

    // Button size
    const buttonSize = isMobile ? 'sm' : isTablet ? 'md' : 'lg';

    // Grid columns
    const gridCols = isXs ? 1 : isSm ? 2 : isTablet ? 2 : 3;

    return {
        screenSize,
        isXs,
        isSm,
        isMobile,
        isTablet,
        scale,
        fontScale,
        spacing,
        buttonSize,
        gridCols,
    };
}

/**
 * Hook for window dimensions
 */
export function useWindowSize() {
    const [size, setSize] = useState({
        width: typeof window !== 'undefined' ? window.innerWidth : 0,
        height: typeof window !== 'undefined' ? window.innerHeight : 0,
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return size;
}

/**
 * Hook for orientation
 */
export function useOrientation() {
    const [orientation, setOrientation] = useState<'portrait' | 'landscape'>(
        typeof window !== 'undefined' && window.innerHeight > window.innerWidth
            ? 'portrait'
            : 'landscape'
    );

    useEffect(() => {
        const handleChange = () => {
            setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
        };

        window.addEventListener('resize', handleChange);
        return () => window.removeEventListener('resize', handleChange);
    }, []);

    return orientation;
}

/**
 * Hook for safe area insets (iOS)
 */
export function useSafeAreaInsets() {
    const [insets, setInsets] = useState({
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateInsets = () => {
            setInsets({
                top: Number(getComputedStyle(document.documentElement).getPropertyValue('--sat')) || 0,
                right: Number(getComputedStyle(document.documentElement).getPropertyValue('--sar')) || 0,
                bottom: Number(getComputedStyle(document.documentElement).getPropertyValue('--sab')) || 0,
                left: Number(getComputedStyle(document.documentElement).getPropertyValue('--sal')) || 0,
            });
        };

        updateInsets();
        window.addEventListener('resize', updateInsets);
        return () => window.removeEventListener('resize', updateInsets);
    }, []);

    return insets;
}
