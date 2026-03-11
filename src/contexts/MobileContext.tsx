import { createContext, useContext, ReactNode } from 'react';
import { useIsMobile, useScreenSize, useOrientation } from '@/hooks/useScreenSize';

interface MobileConfig {
    // Screen info
    screenSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
    isMobile: boolean;
    isTablet: boolean;
    isDesktop: boolean;
    isPortrait: boolean;
    isLandscape: boolean;

    // Scale factors
    scale: number;
    fontScale: number;
    spacingScale: number;

    // Component sizes
    buttonSize: 'sm' | 'md' | 'lg';
    inputHeight: 'sm' | 'md' | 'lg';
    cardPadding: 'sm' | 'md' | 'lg';

    // Layout
    sidebarPosition: 'left' | 'bottom' | 'hidden';
    showBottomNav: boolean;
    gridColumns: number;

    // Touch
    touchTargetMin: number;
}

const defaultConfig: MobileConfig = {
    screenSize: 'lg',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    isPortrait: true,
    isLandscape: false,
    scale: 1,
    fontScale: 1,
    spacingScale: 1,
    buttonSize: 'lg',
    inputHeight: 'lg',
    cardPadding: 'lg',
    sidebarPosition: 'left',
    showBottomNav: false,
    gridColumns: 3,
    touchTargetMin: 44,
};

const getMobileConfig = (
    screenSize: string,
    isMobile: boolean,
    isTablet: boolean,
    orientation: 'portrait' | 'landscape'
): MobileConfig => {
    const isPortrait = orientation === 'portrait';
    const isLandscape = orientation === 'landscape';

    // Base scales
    let scale = 1;
    let fontScale = 1;
    let spacingScale = 1;
    let buttonSize: 'sm' | 'md' | 'lg' = 'lg';
    let inputHeight: 'sm' | 'md' | 'lg' = 'lg';
    let cardPadding: 'sm' | 'md' | 'lg' = 'lg';
    let sidebarPosition: 'left' | 'bottom' | 'hidden' = 'left';
    let showBottomNav = false;
    let gridColumns = 3;
    let touchTargetMin = 44;

    if (screenSize === 'xs') {
        // Extra small mobile - maximum compression
        scale = 0.5;
        fontScale = 0.7;
        spacingScale = 0.5;
        buttonSize = 'sm';
        inputHeight = 'sm';
        cardPadding = 'sm';
        sidebarPosition = 'bottom';
        showBottomNav = true;
        gridColumns = 1;
        touchTargetMin = 40;
    } else if (screenSize === 'sm') {
        // Small mobile
        scale = 0.6;
        fontScale = 0.8;
        spacingScale = 0.6;
        buttonSize = 'sm';
        inputHeight = 'sm';
        cardPadding = 'sm';
        sidebarPosition = 'bottom';
        showBottomNav = true;
        gridColumns = 2;
        touchTargetMin = 44;
    } else if (screenSize === 'md') {
        // Tablet
        scale = 0.75;
        fontScale = 0.9;
        spacingScale = 0.8;
        buttonSize = 'md';
        inputHeight = 'md';
        cardPadding = 'md';
        sidebarPosition = 'left';
        showBottomNav = false;
        gridColumns = 2;
        touchTargetMin = 48;
    }

    return {
        screenSize: screenSize as MobileConfig['screenSize'],
        isMobile,
        isTablet,
        isDesktop: !isMobile && !isTablet,
        isPortrait,
        isLandscape,
        scale,
        fontScale,
        spacingScale,
        buttonSize,
        inputHeight,
        cardPadding,
        sidebarPosition,
        showBottomNav,
        gridColumns,
        touchTargetMin,
    };
};

const MobileContext = createContext<MobileConfig>(defaultConfig);

interface MobileProviderProps {
    children: ReactNode;
}

export function MobileProvider({ children }: MobileProviderProps) {
    const screenSize = useScreenSize();
    const isMobile = useIsMobile();
    const orientation = useOrientation();
    const isTablet = screenSize === 'md';

    const config = getMobileConfig(screenSize, isMobile, isTablet, orientation);

    return (
        <MobileContext.Provider value={config}>
            {children}
        </MobileContext.Provider>
    );
}

export function useMobileContext() {
    const context = useContext(MobileContext);
    if (!context) {
        throw new Error('useMobileContext must be used within MobileProvider');
    }
    return context;
}

// Helper hook for component-specific scaling
export function useComponentScale(componentType: 'button' | 'input' | 'card' | 'text') {
    const { scale, fontScale, spacingScale } = useMobileContext();

    switch (componentType) {
        case 'button':
            return { scale: scale * 1.2, minSize: 36 };
        case 'input':
            return { scale: scale, minSize: 36 };
        case 'card':
            return { scale: scale * 0.8, padding: spacingScale };
        case 'text':
            return { scale: fontScale };
        default:
            return { scale: 1 };
    }
}

export default MobileContext;
